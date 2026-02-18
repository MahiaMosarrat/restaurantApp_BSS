export interface SingInResponse {
    refreshToken: string;
    refreshTokenExpiryTime: string;
    token: string;
    user: {
        email: string;
        fullName: string;
        id: string;
        image: string;
        phoneNumber: string;
        userName: string;
    };
}
export interface IRefreshTokenResponse {
    accessToken: string,
    refreshToken: string,
    refreshTokenExpiryTime: string,
}


// export interface IFood {    
//   id: number,
//   name: string,
//   description: string,
//   price: number,
//   discountType: string,
//   discount: number,
//   discountPrice: string,
//   image:string

// }

// export interface FoodDataResponse {
//     data: IFood[];
//     current_page: number,
//     last_page: number,
//     per_page: number,
//     total: number
// }
