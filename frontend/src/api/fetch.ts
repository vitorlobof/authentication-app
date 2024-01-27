import { Token } from ".";

export default class Fetch {
  private input: string | URL | Request;
  private contentType: string;
  private token: Token;

  constructor(input: string | URL | Request, contentType = "application/json") {
    this.input = input;
    this.contentType = contentType;
    this.token = new Token();
  }

  private headers() {
    return {
      "Content-type": this.contentType,
      Authorization: this.token.authorization(),
    };
  }

  public async get(data?: any): Promise<any> {
    const init: RequestInit = {
      method: "GET",
      headers: this.headers(),
    };

    if (data !== undefined) {
      init.body = JSON.stringify(data);
    }

    let response = await fetch(this.input, init);
    let responseData: any = await response.json();

    if (response.status === 401 && responseData.code === "token_not_valid") {
      const refreshed = await this.token.refreshAccess();
      if (refreshed) {
        response = await this.get(data);
      } else {
        return {
          ok: response.ok,
          status: response.status,
          code: "refresh_token_expired",
          detail: "You have to login in again.",
        };
      }
    }

    return { ok: response.ok, status: response.status, data: responseData };
  }
}
