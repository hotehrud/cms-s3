<template>
  <div class="login-form">
    <div class="login-icon">
      <svg width="100%" height="100%" viewBox="0 0 24 24">
        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"></path>
      </svg>
    </div>
    <span class="form-title">Login</span>
    <form>
      <fieldset>
        <div class="fields">
          <div class="field">
            <!-- <label data-line='Username'> -->
            <input type='text' id="authId" placeholder="Username" />
            <!-- </label> -->
          </div>
          <div class="field">
            <!-- <label data-line='Password'> -->
            <input type='password' id="authPs" placeholder="Password" />
            <!-- </label> -->
          </div>
        </div>
        <div class="check">
          <label class="cb">
            <input id="remember" type="checkbox" />
            <span class="cb-field"></span>
            <span class="cb-text">
              <span>Remember me</span>
            </span>
          </label>
        </div>
        <p class="text-alert">{{ loginMessage }}</p>
        <div class="btn-login" @click="login">
          Login
        </div>
      </fieldset>
    </form>
  </div>
</template>

<script>
export default {
  computed: {
    loginMessage() {
      return this.$store.getters.loginMessage;
    }
  },
  methods: {
    async login() {
      let id = document.getElementById("authId");
      let ps = document.getElementById("authPs");
      let remember = document.getElementById("remember");
      await this.$store.dispatch("loginUser", {
        id: id.value,
        ps: ps.value,
        keep: remember.checked
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login-form {
  position: fixed;
  left: 50%;
  transform: translate(-50%, 0);
  margin: auto;
  width: 350px;
  max-width: 100%;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  border-radius: 4px;
  padding: 15px;
  background-color: white;
}

.login-icon {
  height: 100px;
  width: 100px;
  margin: auto;
  background-color: #000;
  margin-bottom: 15px;
  border-radius: 50%;
  padding: 10px;
  svg {
    stroke: white;
    fill: white;
  }
}

.form-title {
  margin-bottom: 15px;
  width: 100%;
  text-align: center;
  display: block;
  font-size: 1.6em;
}

input[type="text"],
input[type="password"],
input[type="submit"] {
  width: 100%;
}

input[type="text"],
input[type="password"] {
  font-size: 1em;
  border: none;
  padding: 5px 10px;
  position: relative;
  &:focus,
  &:active {
    outline: none;
  }
}

.text-alert {
  margin: 5px;
  color: red;
}

.btn-login {
  -webkit-appearance: none;
  padding: 7.5px 15px;
  background-color: #000;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.2em;
  text-align: center;
  cursor: pointer;
  &:hover,
  &:active,
  &:focus {
    background-color: #000;
    outline: none;
  }
  &:active {
    background-color: #000;
  }
}

fieldset {
  border: none;
  padding: 0;
  margin: 0;
  .fields {
    .field {
      border-bottom: 2px solid #eee;
    }
    .field:not(:last-child) {
      margin-bottom: 30px;
    }
    .field:last-child {
      margin-bottom: 15px;
    }
    label {
      display: block;
      border-bottom: 1px solid lightgray;
      position: relative;
    }
    label.filled,
    label.active {
      border-color: black;
    }
    label:after {
      content: attr(data-line);
      transition: all 0.2s linear;
      position: absolute;
      top: 5px;
      left: 10px;
      color: lightgray;
      font-weight: bold;
    }
    label.filled:after,
    label.active:after {
      top: -15px;
      left: 0;
      color: black;
    }
  }
  .inputs {
    margin-top: 15px;
  }
  .check {
    margin-bottom: 15px;
  }
}

input[type="checkbox"] {
  width: 0;
  height: 0;
  display: none;
  &:checked + span {
    color: black;
  }
}
.cb {
  display: flex;
  height: 20px;
  padding-left: 10px;
  .cb-field {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 1px solid lightgray;
    margin-right: 5px;
  }
  .cb-text {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    color: lightgray;
  }
  input[type="checkbox"]:checked + span {
    border-color: black;
    &:after {
      content: "";
      box-sizing: border-box;
      transform: rotate(45deg);
      width: 40%;
      height: 60%;
      position: absolute;
      top: 10%;
      left: 35%;
      border-bottom: 2px solid #000;
      border-right: 2px solid #000;
    }
  }
  input[type="checkbox"]:checked + span + span {
    color: black;
  }
}
</style>
