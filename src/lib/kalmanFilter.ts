export class KalmanFilter {
  private Q: number; // process noise
  private R: number; // measurement noise
  private P: number; // estimation error covariance
  private x: number; // value
  private K: number; // kalman gain

  constructor(Q: number, R: number, initialValue: number) {
    this.Q = Q;
    this.R = R;
    this.P = 1;
    this.x = initialValue;
    this.K = 0;
  }

  setNoise(Q: number, R: number) {
    this.Q = Q;
    this.R = R;
  }

  filter(measurement: number): number {
    // Prediction
    this.P = this.P + this.Q;

    // Measurement update
    this.K = this.P / (this.P + this.R);
    this.x = this.x + this.K * (measurement - this.x);
    this.P = (1 - this.K) * this.P;

    return this.x;
  }
}
