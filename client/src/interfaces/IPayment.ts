export interface IPayment {
  numberTarget: string;
  context: string;
  amount: number;
  cvc: string;
}

export interface IPaymentRecord extends IPayment {
  _id: string;
  id?: string;
  date: string;
  createdAt: string;
  user?: {
    _id: string;
    id?: string;
    name: string;
    username: string;
    email: string;
  };
}