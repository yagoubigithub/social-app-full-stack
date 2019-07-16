const isEmail = (email) =>{
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(emailRegEx);
  
  }
  const isEmpty = (string) => string.trim() === '';

  
  exports.validateSignUpData = (data) =>{
    let errors = {};
    if(isEmpty(data.email)){
      errors.email = "Must not be Empty";
    }else if(!isEmail(data.email)){
      errors.email = "Must be valid email address  "
    }
    if(isEmpty(data.password)){
      errors.password = "Must not be Empty";
    }
    if(data.password !== data.confirmPassword) errors.confirmPassword = "Password must match"
  
  


    return {
        errors,
        valid : Object.keys(errors).length === 0 ? true : false
    }
  }

  exports.validateLoginData = (user) =>{
    let errors = {};
  
    if(isEmpty(user.email)) errors.email = "Must not be empty";
    if(isEmpty(user.password)) errors.password = "Must not be empty";
  
    

    return {
        errors,
        valid : Object.keys(errors).length === 0 ? true : false
    }
  }