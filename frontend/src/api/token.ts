import { cookies } from "next/headers";
import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { urls } from ".";

export default class Token {
  public access: string | null = null;
  public refresh: string | null = null;
  private cookies: ReadonlyRequestCookies = cookies();

  constructor(tokenPair?: { access: string; refresh: string }) {
    if (tokenPair !== undefined) {
      this.access = tokenPair.access;
      this.refresh = tokenPair.refresh;
    } else {
      const token = this.get();
      if (token !== null) {
        this.access = token.access;
        this.refresh = token.refresh;
      }
    }
  }

  toString() {
    return `access: ${this.access}\nrefresh: ${this.refresh}`;
  }

  private get() {
    const accessToken = this.cookies.get("accessToken");
    const refreshToken = this.cookies.get("refreshToken");
    if (accessToken !== undefined) this.access = accessToken.value;
    if (refreshToken !== undefined) this.refresh = refreshToken.value;
    return { access: this.access, refresh: this.refresh };
  }

  public save() {
    if (this.access !== null) this.cookies.set("accessToken", this.access);
    if (this.refresh !== null) this.cookies.set("refreshToken", this.refresh);
  }

  public delete() {
    this.cookies.delete('accessToken');
    this.cookies.delete('refreshToken');
  }

  public authorization() {
    return `Bearer ${this.access}`;
  }

  public async refreshAccess(): Promise<boolean> {
    if (this.refresh === null) return false;

    const response = await fetch(urls.refreshToken, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ refresh: this.refresh }),
    });

    if (!response.ok) return false;

    const { access } = await response.json();
    this.access = access;

    return true;
  }

  public async verify(): Promise<boolean> {
    if (this.refresh === null) return false;

    const response = await fetch(urls.verifyToken, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ token: this.refresh }),
    });

    return response.ok;
  }
}
