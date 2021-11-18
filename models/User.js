const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//schema
var userSchema = mongoose.Schema({
    username:{
      type:String,
      required:[true,'아이디는 필수입니다.'],
      match:[/^.{4,12}$/,'Should be 4-12 characters!'], 
      trim:true, // 문자열앞뒤에 빈칸이 있는 경우 빈칸을 제거해주는 옵션 
      unique:true
    },
    password:{
      type:String,
      required:[true,'비밀번호는 필수입니다.'],
      select:false
    },
    name:{
      type:String,
      required:[true,'이름은 필수입니다.'],
      match:[/^.{4,12}$/,'Should be 4-12 characters!'], 
      trim:true 
    },
    email:{
      type:String,
      match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'이메일형식에 맞춰 입력해주세요'], 
      trim:true 
    }
  },{
    toObject:{virtuals:true}
  });

//virtuals : 회원가입, 회원정보 수정을 위해 필요하지만 db에는 저장할 필요없는 값을 확인하고 정의
userSchema.virtual('passwordConfirm')
    .get(function(){return this._passwordComfirm;})
    .set(function(value){this._passwordComfirm=value;});

userSchema.virtual('originalPassword')
    .get(function(){return this._orginalPassword;})
    .set(function(value){this._orginalPassword;});

userSchema.virtual('currentPassword')
    .get(function(){return this._currentPassword;})
    .set(function(value){this._currentPassword;});

userSchema.virtual('newPassword')
    .get(function(){return this._newPassword;})
    .set(function(value){this._newPassword;});

//password validation
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/; // 2-1
const passwordRegexErrorMessage = '8자리이상 숫자와 문자조합으로 작성해주세요';
userSchema.path('password').validate(function (v) {
    const user = this;

    if(user.isNew){
        if(!user.passwordConfirmation){
          user.invalidate('passwordConfirmation', 'Password Confirmation is required.');
        }
        if(!passwordRegex.test(user.password)){ 
          user.invalidate('password', passwordRegexErrorMessage); 
        }
        else if(user.password !== user.passwordConfirmation) {
          user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
        }
      }
    //정보수정
    if(!user.isNew){
        if(!user.currentPassword){
          user.invalidate('currentPassword', 'Current Password is required!');
        }
        else if(!bcrypt.compareSync(user.currentPassword, user.originalPassword)){
          user.invalidate('currentPassword', 'Current Password is invalid!');
        }
    
        if(user.newPassword && !passwordRegex.test(user.newPassword)){ // 2-3
          user.invalidate("newPassword", passwordRegexErrorMessage); // 2-4
        }
        else if(user.newPassword !== user.passwordConfirmation) {
          user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
        }
      }
    });

userSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')){
        return next();
    }else{
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
});

userSchema.methods.authenticate = function (password){
    const user = this;
    return bcrypt.compareSync(password, user.password);
}
const User = mongoose.model('user', userSchema);
module.exports = User;