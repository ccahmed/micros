export class User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  verificationCode: string;
  role: 'ADMIN' | 'USER';
  resetToken: string;
  tokenExpiration: Date;

  constructor(
    email: string = "",
    password: string = "",
    firstName: string = "",
    lastName: string = "",
    role: 'ADMIN' | 'USER' = 'USER',
    verificationCode: string = "",
    resetToken: string = "",
    tokenExpiration: Date = new Date()
  ) {
    this.email = email;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.verificationCode = verificationCode;
    this.resetToken = resetToken;
    this.tokenExpiration = tokenExpiration;
  }


}
