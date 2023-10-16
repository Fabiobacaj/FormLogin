const _v = {
  hasError: false,
  isValidPassword: false,
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,4}$/,
};
function formValidation(form, notifica) {
  _v.form = document.querySelector(`${form}`);
  _v.notificationItem = document.querySelector(`${notifica}`);
  _v.passwordStrength = document.querySelectorAll("#password > span");
  _v.formItems = Array.from(_v.form.elements);
  v.messagePattern = document.getElementById('#password > span#message');
  //console.log(_v.messagePattern)
  submitForm();
  checkPasswordStrength();
}

function submitForm() {
  _v.form.addEventListener(
    "submit",
    (e) => {
      e.stopPropagation();
      e.preventDefault();
      checkValidation();
    },
    true
  );
}
function checkValidation() {
  try {
    //controllo tutti i campi devono essere compilti
    requiredFields();

    //controllare che la mail sia valida
    isValidEmail();

    //controllo validità password
    checkPassword();

    //controlli superati
    _v.notificationItem.textContent =
      "La registrazione  è avvenuta corretamente";
    resetform();
  } catch (e) {
    _v.notificationItem.textContent = e.message;
  }
}

function resetform() {
  _v.form.reset();
  resetPasswordStrength();
  _v.formItems.forEach((el)=>{
    el.classList.remove('error')
  })
}

function resetPasswordStrength() {
  _v.passwordStrength.forEach((el) => {
    el.classList.remove("active");
  });
}
function requiredFields() {
  let error;
  _v.hasError = false;
  _v.formItems.forEach((item) => {
    error = false;
    if (item.type !== "checkbox" && item.required && item.value === "") {
      error = true;
    }
    if (item.type === "checkbox" && item.required && !item.checked) {
      error = true;
    }
    if (error) {
      _v.hasError = true;
      item.classList.add("error");
    }
  });
  if (_v.hasError) {
    throw new Error("compilare i campi obbligatori");
  }
}
function isValidEmail() {
  if (!_v.emailPattern.test(_v.form.email.value)) {
    throw new Error("Email indicata non valida");
  }
}

function checkPassword() {
  const pwd = _v.form.password.value,
    re_pwd = _v.form.re_password.value;
  if (!_v.isValidPassword) {
    throw new Error("Password non valida");
  }
  if (pwd !== re_pwd) {
    throw new Error("Le password non Coincidono");
  }
}

//8 caratteri => valida ma non sicura
// 8 caratteri e un carattere speciale => mediamente sicura
// lunga almeno 10 e 2 caratteri speciali =>  molto sicura

function checkPasswordStrength() {
  _v.form.password.addEventListener("keyup", (e) => {
    const isValid = {
        isLow: false,
        isHigh: false,
      },
      pwd = e.target.value;
      resetPasswordStrength();
    if (pwd.length >= 8) {
      _v.passwordStrength[0].classList.add("active");
      //_v.messagePattern.textContent = 'poco sicura'
      if (regexCount(/[&%?!]/g, pwd) === 1) {
        _v.passwordStrength[1].classList.add("active");
        isValid.isLow = true;
      }
      if (regexCount(/[&%?!]/g, pwd) === 2) {
        _v.passwordStrength.forEach((el) => {
          el.classList.add("active");
        });
        isValid.isHigh = true;
      }
      _v.isValidPassword = isValid.isLow || isValid.isHigh ? true : false;
    }
  });
}
function regexCount(pattern, password) {
  return (password.match(pattern) || []).length;
}

export default formValidation;
