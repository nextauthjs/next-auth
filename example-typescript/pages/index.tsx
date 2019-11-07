import React, { FormEvent } from "react";
import Router from "next/router";
import Link from "next/link";
import { NextAuth } from "../../client";
import { NextContext } from "next";
import { INextAuthSessionData } from "../../client";


interface IIndexPropsType {
  session: INextAuthSessionData;
}

export default class extends React.Component<IIndexPropsType> {
  static async getInitialProps({ req }: NextContext) {
    return {
      session: await NextAuth.init({ req, force: false })
    };
  }

  constructor(props) {
    super(props);
    this.handleSignOutSubmit = this.handleSignOutSubmit.bind(this);
  }

  handleSignOutSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    NextAuth.signout()
      .then(() => {
        Router.push("/auth/callback");
      })
      .catch(err => {
        console.log(err);
        Router.push("/auth/error?action=signout");
      });
  }

  render() {
    return (
      <div className="container">
        <div className="text-center">
          <h1 className="display-4 mt-3 mb-3">NextAuth Example</h1>
          <p className="lead mt-3 mb-3">
            An example of how to use the{" "}
            <a href="https://www.npmjs.com/package/next-auth">NextAuth</a>{" "}
            module.
          </p>
          <SignInMessage {...this.props} onSubmitCallback={this.handleSignOutSubmit} />
        </div>
      </div>
    );
  }
}

interface ISignInMessagePropsType extends IIndexPropsType {
  onSubmitCallback: (event: FormEvent<HTMLFormElement>) => void;
}

export class SignInMessage extends React.Component<ISignInMessagePropsType> {
  render() {
    if (this.props.session.user) {
      return (
        <React.Fragment>
          <p>
            <Link href="/auth">
              <a className="btn btn-secondary">Manage Account</a>
            </Link>
          </p>
          <form
            id="signout"
            method="post"
            action="/auth/signout"
            onSubmit={this.props.onSubmitCallback}
          >
            <input
              name="_csrf"
              type="hidden"
              value={this.props.session.csrfToken}
            />
            <button type="submit" className="btn btn-outline-secondary">
              Sign out
            </button>
          </form>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <p>
            <Link href="/auth">
              <a className="btn btn-primary">Sign in</a>
            </Link>
          </p>
        </React.Fragment>
      );
    }
  }
}
