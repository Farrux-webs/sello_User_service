export declare interface SignInRequest {
    email: string
    password: string
    token?: string
    username?: string
}

export declare interface SignInResponse {
    accessToken: string
    refreshToken: string
}
