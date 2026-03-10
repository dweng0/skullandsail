export interface RemotePlayer {
    playerId: number
    captainName: string
    shipClass: string
    x: number
    z: number
    heading: number
    level: number
    status: 'Connected' | 'Connecting' | 'Disconnected'
    ping: number
    isHost?: boolean
}

export interface MultiplayerSessionConfig {
    sessionCode: string
    playerId: number
    isHost: boolean
    peers: Map<number, RTCPeerConnection>
    dataChannels: Map<number, RTCDataChannel>
}

export class MultiplayerManager {
    private sessionCode: string | null = null
    private playerId: number | null = null
    private isHost = false
    private peers = new Map<number, RTCPeerConnection>()
    private dataChannels = new Map<number, RTCDataChannel>()
    private remotePlayersState = new Map<number, RemotePlayer>()
    private iceCandidatesQueue = new Map<number, RTCIceCandidate[]>()
    private disconnectTimers = new Map<number, NodeJS.Timeout>()
    private positionUpdateCallbacks: Array<(players: RemotePlayer[]) => void> =
        []

    private static readonly STUN_SERVERS = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ]

    private static readonly ICE_CONFIG = {
        iceServers: MultiplayerManager.STUN_SERVERS,
        iceTransportPolicy: 'all' as RTCIceTransportPolicy,
    }

    async joinMultiplayerSession(code: string): Promise<boolean> {
        try {
            this.sessionCode = code.toUpperCase()
            this.playerId = Math.floor(Math.random() * 4) + 1
            this.isHost = false
            return true
        } catch (error) {
            console.error('Failed to join multiplayer session:', error)
            return false
        }
    }

    async createMultiplayerSession(): Promise<string> {
        try {
            this.sessionCode = Math.random()
                .toString(36)
                .substr(2, 8)
                .toUpperCase()
            this.playerId = 1
            this.isHost = true
            return this.sessionCode
        } catch (error) {
            console.error('Failed to create multiplayer session:', error)
            throw error
        }
    }

    async connectPeer(remotePeerId: number): Promise<RTCPeerConnection> {
        const peerConnection = new RTCPeerConnection(
            MultiplayerManager.ICE_CONFIG,
        )

        // Ice candidate handling
        peerConnection.addEventListener('icecandidate', (event) => {
            if (event.candidate) {
                this.sendIceCandidate(remotePeerId, event.candidate)
            }
        })

        // Connection state changes
        peerConnection.addEventListener('connectionstatechange', () => {
            this.handlePeerConnectionStateChange(remotePeerId, peerConnection)
        })

        this.peers.set(remotePeerId, peerConnection)
        this.iceCandidatesQueue.set(remotePeerId, [])

        return peerConnection
    }

    async createDataChannel(
        remotePeerId: number,
        peerConnection: RTCPeerConnection,
    ): Promise<RTCDataChannel> {
        const dataChannel = peerConnection.createDataChannel('gameState', {
            ordered: true,
            maxPacketLifeTime: 3000,
        })

        this.setupDataChannelListeners(remotePeerId, dataChannel)
        this.dataChannels.set(remotePeerId, dataChannel)

        return dataChannel
    }

    onDataChannel(remotePeerId: number, event: RTCDataChannelEvent): void {
        const dataChannel = event.channel
        this.setupDataChannelListeners(remotePeerId, dataChannel)
        this.dataChannels.set(remotePeerId, dataChannel)
    }

    private setupDataChannelListeners(
        remotePeerId: number,
        dataChannel: RTCDataChannel,
    ): void {
        dataChannel.addEventListener('open', () => {
            this.updateRemotePlayerStatus(remotePeerId, 'Connected')
            this.clearDisconnectTimer(remotePeerId)
        })

        dataChannel.addEventListener('message', (event) => {
            try {
                const message = JSON.parse(event.data)
                this.handleRemoteMessage(remotePeerId, message)
            } catch (error) {
                console.error('Failed to parse data channel message:', error)
            }
        })

        dataChannel.addEventListener('close', () => {
            this.handleRemoteDisconnect(remotePeerId)
        })

        dataChannel.addEventListener('error', (error) => {
            console.error(
                `Data channel error with peer ${remotePeerId}:`,
                error,
            )
            this.handleRemoteDisconnect(remotePeerId)
        })
    }

    sendPositionUpdate(
        x: number,
        z: number,
        heading: number,
        velocity: number,
    ): void {
        const update = {
            type: 'position',
            x,
            z,
            heading,
            velocity,
            timestamp: Date.now(),
        }

        this.dataChannels.forEach((channel) => {
            if (channel.readyState === 'open') {
                channel.send(JSON.stringify(update))
            }
        })
    }

    sendChatMessage(text: string): void {
        const message = {
            type: 'chat',
            playerId: this.playerId,
            text,
            timestamp: Date.now(),
        }

        this.dataChannels.forEach((channel) => {
            if (channel.readyState === 'open') {
                channel.send(JSON.stringify(message))
            }
        })
    }

    sendEmote(emoteType: string): void {
        const emote = {
            type: 'emote',
            playerId: this.playerId,
            emoteType,
            timestamp: Date.now(),
        }

        this.dataChannels.forEach((channel) => {
            if (channel.readyState === 'open') {
                channel.send(JSON.stringify(emote))
            }
        })
    }

    private handleRemoteMessage(remotePeerId: number, message: any): void {
        switch (message.type) {
            case 'position':
                this.handleRemotePosition(remotePeerId, message)
                break
            case 'chat':
                this.handleRemoteChat(remotePeerId, message)
                break
            case 'emote':
                this.handleRemoteEmote(remotePeerId, message)
                break
        }
    }

    private handleRemotePosition(remotePeerId: number, message: any): void {
        const player = this.remotePlayersState.get(remotePeerId)
        if (player) {
            player.x = message.x
            player.z = message.z
            player.heading = message.heading
        }
        this.notifyPositionUpdates()
    }

    private handleRemoteChat(_remotePeerId: number, message: any): void {
        // Chat messages would be displayed in game UI
        console.log(`[${message.playerId}]: ${message.text}`)
    }

    private handleRemoteEmote(_remotePeerId: number, message: any): void {
        // Emotes would be displayed above ship
        console.log(
            `Player ${message.playerId} used emote: ${message.emoteType}`,
        )
    }

    private handlePeerConnectionStateChange(
        remotePeerId: number,
        peerConnection: RTCPeerConnection,
    ): void {
        switch (peerConnection.connectionState) {
            case 'connected':
                this.updateRemotePlayerStatus(remotePeerId, 'Connected')
                this.clearDisconnectTimer(remotePeerId)
                break
            case 'disconnected':
                this.scheduleDisconnectTimer(remotePeerId)
                break
            case 'failed':
            case 'closed':
                this.handleRemoteDisconnect(remotePeerId)
                break
        }
    }

    private scheduleDisconnectTimer(remotePeerId: number): void {
        // 30-second timeout for reconnection
        const timer = setTimeout(() => {
            this.removeRemotePlayer(remotePeerId)
        }, 30000)

        this.disconnectTimers.set(remotePeerId, timer)
        this.updateRemotePlayerStatus(remotePeerId, 'Disconnected')
    }

    private clearDisconnectTimer(remotePeerId: number): void {
        const timer = this.disconnectTimers.get(remotePeerId)
        if (timer) {
            clearTimeout(timer)
            this.disconnectTimers.delete(remotePeerId)
        }
    }

    private handleRemoteDisconnect(remotePeerId: number): void {
        const timer = this.disconnectTimers.get(remotePeerId)
        if (!timer) {
            this.scheduleDisconnectTimer(remotePeerId)
        }
    }

    private removeRemotePlayer(remotePeerId: number): void {
        this.remotePlayersState.delete(remotePeerId)
        this.clearDisconnectTimer(remotePeerId)

        const peer = this.peers.get(remotePeerId)
        if (peer) {
            peer.close()
            this.peers.delete(remotePeerId)
        }

        const channel = this.dataChannels.get(remotePeerId)
        if (channel) {
            channel.close()
            this.dataChannels.delete(remotePeerId)
        }

        this.notifyPositionUpdates()
    }

    private updateRemotePlayerStatus(
        remotePeerId: number,
        status: 'Connected' | 'Connecting' | 'Disconnected',
    ): void {
        const player = this.remotePlayersState.get(remotePeerId)
        if (player) {
            player.status = status
        }
    }

    private sendIceCandidate(
        _remotePeerId: number,
        _candidate: RTCIceCandidate,
    ): void {
        // In real implementation, this would send via signaling server
        // console.log(`ICE candidate for peer ${_remotePeerId}:`, _candidate)
    }

    async addIceCandidate(
        remotePeerId: number,
        candidate: RTCIceCandidate,
    ): Promise<void> {
        const peer = this.peers.get(remotePeerId)
        if (peer) {
            try {
                await peer.addIceCandidate(candidate)
            } catch (error) {
                console.error(
                    `Failed to add ICE candidate for peer ${remotePeerId}:`,
                    error,
                )
            }
        }
    }

    addRemotePlayer(player: RemotePlayer): void {
        this.remotePlayersState.set(player.playerId, player)
        this.notifyPositionUpdates()
    }

    getRemotePlayers(): RemotePlayer[] {
        return Array.from(this.remotePlayersState.values())
    }

    onPositionUpdate(callback: (players: RemotePlayer[]) => void): void {
        this.positionUpdateCallbacks.push(callback)
    }

    private notifyPositionUpdates(): void {
        this.positionUpdateCallbacks.forEach((callback) => {
            callback(this.getRemotePlayers())
        })
    }

    isConnected(): boolean {
        return this.sessionCode !== null && this.playerId !== null
    }

    getPlayerId(): number | null {
        return this.playerId
    }

    getSessionCode(): string | null {
        return this.sessionCode
    }

    getSessionConfig(): MultiplayerSessionConfig | null {
        if (!this.sessionCode || !this.playerId) {
            return null
        }

        return {
            sessionCode: this.sessionCode,
            playerId: this.playerId,
            isHost: this.isHost,
            peers: this.peers,
            dataChannels: this.dataChannels,
        }
    }

    saveSessionState(): any {
        return {
            sessionCode: this.sessionCode,
            playerId: this.playerId,
            isHost: this.isHost,
            timestamp: Date.now(),
        }
    }

    loadSessionState(state: any): boolean {
        if (Date.now() - state.timestamp > 24 * 60 * 60 * 1000) {
            console.log('Session expired')
            return false
        }

        this.sessionCode = state.sessionCode
        this.playerId = state.playerId
        this.isHost = state.isHost
        return true
    }

    disconnect(): void {
        this.peers.forEach((peer) => {
            peer.close()
        })
        this.dataChannels.forEach((channel) => {
            channel.close()
        })
        this.peers.clear()
        this.dataChannels.clear()
        this.remotePlayersState.clear()
        this.disconnectTimers.forEach((timer) => clearTimeout(timer))
        this.disconnectTimers.clear()
        this.sessionCode = null
        this.playerId = null
    }
}

export default MultiplayerManager
