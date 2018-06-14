// Requirement, Auth logic like cognito.
// ** Example Cognito **

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
    // Get, current User from localStorage
    const storage = window.localStorage;
    Object.keys(storage).forEach(key => {
      if (key.indexOf("idToken") > -1) {
        AWS.config.region = "ap-northeast-2";
        AWS.config.credentials = this.getCognitoIdentityCredentials({
          idToken: storage[key]
        });
      }
    });

    this.session = {};
    this.poolData = {
      UserPoolId: COGNITO_USER_POOL_ID,
      ClientId: COGNITO_CLIENT_ID
    };
    this.userPool = new CognitoUserPool(this.poolData);
  }

  async authorizeUser() {
    if (document.cookie.indexOf("auth=ok") < 0) {
      return false;
    } else {
      return true;
    }
    let session = await this.getSession();
    return new Promise(reslove => {
      if (!session) {
        reslove(false);
      }
      const tokens = this.session.user.signInUserSession;

      AWS.config.credentials = this.getCognitoIdentityCredentials(tokens);
      AWS.config.credentials.get(err => {
        reslove(true);
      });
    });
  }

  loginUser(username, password) {
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

          window.location.href = "/";
        },
        onFailure: err => {
          console.log(err);
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
    if (cognitoUser !== null) {
      cognitoUser.signOut();
    }
  }

  getSession() {
    return new Promise(reslove => {
      let cognitoUser = this.userPool.getCurrentUser();
      if (cognitoUser !== null) {
        cognitoUser.getSession((err, session) => {
          if (err) {
            console.log(err);
            this.logoutUser();
          }
          this.session.user = cognitoUser;
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
