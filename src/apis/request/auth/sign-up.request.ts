export default interface SignUpRequestDto{
    userEmail : string,
    password : string,
    nickname : string,
    telNumber : string,
    address : string,
    addressDetail : string | null,
    agreedPersonal : boolean
}