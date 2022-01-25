const pwd = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,18}$/;

const username = /^[\S]{4,12}$/;

const mobilePhone = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;

export { pwd, username, mobilePhone };
