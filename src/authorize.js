import AWS from "aws-sdk";
import {
  CognitoUser,
  CognitoUserPool,
  AuthenticationDetails
} from "amazon-cognito-identity-js";
import config from "@/config/s3";

const COGNITO_IDENTITY_POOL_ID = config.COGNITO_IDENTITY_POOL_ID;
const COGNITO_USER_POOL_ID = config.COGNITO_USER_POOL_ID;
const COGNITO_CLIENT_ID = config.COGNITO_CLIENT_ID;
const AWS_REGION = config.AWS_REGION;

export default class Authorize {
  constructor() {
    if (window.localStorage.getItem("loginKeep")) {
      this.keep = true;
    }

    AWS.config.region = AWS_REGION;
    this.session = {};
    this.poolData = {
      UserPoolId: COGNITO_USER_POOL_ID,
      ClientId: COGNITO_CLIENT_ID
    };
    this.userPool = new CognitoUserPool(this.poolData);
  }

  keepLogin() {
    return new Promise(reslove => {
      const storage = window.localStorage;
      Object.keys(storage).forEach(key => {
        if (key.indexOf("idToken") > -1) {
          AWS.config.credentials = this.getCognitoIdentityCredentials({
            idToken: storage[key]
          });
          AWS.config.credentials.get(async err => {
            if (err) {
              // console.log(err);
              // console.log(AWS.config.credentials);
            }

            if (AWS.config.credentials.expired) {
              await this.authorizeUser();
            }
            reslove(true);
          });
        }
      });
    });
  }

  async authorizeUser() {
    if (
      !window.localStorage.getItem("loginKeep") &&
      document.cookie.indexOf("auth=ok") < 0
    ) {
      return false;
    }
    let session = await this.getSession();
    return new Promise(reslove => {
      if (!session) {
        reslove(false);
      }
      const tokens = this.session.user;

      AWS.config.credentials = this.getCognitoIdentityCredentials(tokens);
      AWS.config.credentials.get(err => {
        if (err) {
          // console.log(err);
        }

        if (AWS.config.credentials.expired) {
          reslove(false);
        } else {
          reslove(true);
        }
      });
    });
  }

  loginUser(username, password, keep) {
    return new Promise(reslove => {
      let authData = {
        Username: username,
        Password: password
      };

      let authDetails = new AuthenticationDetails(authData);

      let userData = {
        Username: username,
        Pool: this.userPool
      };

      let cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authDetails, {
        onSuccess: session => {
          var now = new Date();
          var time = now.getTime();
          var expireTime = time + 1000 * 3600 - 60000;
          now.setTime(expireTime);
          document.cookie = "auth=ok;expires=" + now.toGMTString() + ";path=/";

          if (keep) {
            window.localStorage.setItem("loginKeep", true);
          }

          window.location.href = "/";
        },
        onFailure: err => {
          // console.log(err);
          reslove({
            code: 400,
            msg: err.message
          });
        }
      });
    });
  }

  logoutUser() {
    let cognitoUser = this.userPool.getCurrentUser();
    document.cookie =
      "auth=ok;expires=" + "Thu, 01 Jan 1970 00:00:01 GMT" + ";path=/";
    window.localStorage.removeItem("loginKeep");

    if (cognitoUser !== null) {
      cognitoUser.signOut();
    }
    window.location.href = "/login";
  }

  getSession() {
    return new Promise(reslove => {
      let cognitoUser = this.userPool.getCurrentUser();
      if (window.localStorage.getItem("loginKeep") || cognitoUser !== null) {
        cognitoUser.getSession((err, session) => {
          if (err) {
            this.logoutUser();
          }
          this.session.user = {
            idToken: session.idToken.jwtToken
          };
          reslove(true);
        });
      } else {
        this.logoutUser();
        reslove(false);
      }
    });
  }

  getCognitoIdentityCredentials(tokens) {
    const loginInfo = {};
    loginInfo[
      `cognito-idp.${AWS_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`
    ] =
      tokens.idToken;
    const params = {
      IdentityPoolId: COGNITO_IDENTITY_POOL_ID,
      Logins: loginInfo
    };
    return new AWS.CognitoIdentityCredentials(params);
  }
}
