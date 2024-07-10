enum ResponseCode {

    // 200
    SUCCESS = "SU",

    //400
    VALIDATION_FAILED = "VF",
    DUPLICATE_EMAIL = "DE",
    DUPLICATE_NICKNAME = "DN",
    DUPLICATE_TEL_NUMBER = "DT",
    NOT_EXIST_USER = "NU",
    NOT_EXIST_BOARD = "NB",

    //401
    SIGN_IN_FAILED = "SF",
    AUTHENTICATION_FAILED = "AF",

    //403
    NO_PERMISSION = "NP",

    // 500
    DATABASE_ERROR = "DBE"


}

export default ResponseCode;