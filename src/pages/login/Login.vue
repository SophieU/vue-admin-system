<style scoped lang="scss">
  @import './login.scss';
</style>
<template>
    <div class="login-page">
      <div class="login-container">
        <img class="top-circle" src="./img_2.png" alt="">
          <div class="left-img"></div>
          <div class="right-form">
            <div class="login-title">
              <h3>呼叫中心管理系统 <span class="text-grey">V1.0.0</span></h3>
              <p class="text-grey welcome">欢迎您，请登录</p>
            </div>
            <div class="login-form">
              <Form ref="loginForm" :model="formLogin" :rules="ruleLogin" label-position="top">
                <form-item class="form-group" prop="username">
                  <label :class="focus==='账号'?'focus form-label':'form-label'">账号</label>
                  <!--<input @blur="validatei-input" @focus="focus='账号'" class="form-control" type="text" v-model="formLogin.username" />-->
                  <i-input @on-enter="validateLogin(formLogin)"  @on-blur="focus=''" v-model="formLogin.username" @on-focus="focus='账号'"/>
                </form-item>
                <form-item class="form-group" prop="password">
                  <label :class="focus==='密码'?'focus form-label':'form-label'">密码</label>
                  <i-input   @on-enter="validateLogin(formLogin)" @on-blur="focus=''"  @on-focus="focus='密码'" type="password" v-model="formLogin.password" />
                </form-item>
                <Button class="loginBtn" @click="validateLogin(formLogin)" type="primary" long>登录</Button>
              </Form>
            </div>
            <div class="copyright">
              Copyright©2018 天富一生约 All Rights Reserved.
            </div>
          </div>
      </div>
    </div>
</template>

<script>
  // import iView from 'iview'
  import Cookie from 'js-cookie'
  import util from '../../libs/util'
    export default {
        name: "Login",
        data:()=>{
          //自定义验证手机号
          const validateTel=(rule,value,callback)=>{
            let telReg = /^1[3456789]\d{9}/;
            if(!telReg.test(value)){
              callback(new Error('请输入正确的手机号码'))
            }else{
              callback();
            }
          };
          return {
            focus:'',
            formLogin:{
              username:'',
              password:'',
            },
            ruleLogin:{
              username:[
                {required:true,message:'请输入账号',trigger:'blur'},
                // {validator:validateTel,trigger:'blur'},
              ],
              password:[
                {required:true,message:'请输入密码',trigger:'blur'},
                {type:'string',min:6,message:'密码至少6位'}
              ]
            },
            loginSuccess:false
          }
        },
      methods:{
        //验证登录
        validateLogin(){
          this.$refs.loginForm.validate((valid)=>{
            if(valid){
              let userName = this.formLogin.username;
              let password = this.formLogin.password;
              iview.LoadingBar.start();
              this.$http.defaults.withCredentials=true;
              // this.$http.headers['Content-Type']='application/x-www-form-urlencoded';
              this.$http.post(`/user/login?loginName=${userName}&password=${password}`)
                .then(res=>{
                  let data = res.data;
                  if(data.code===0){
                    //登录成功
                    Cookie.set('user',userName);
                    this.loading=this.$Message.loading({
                      content:'登录成功，页面即将跳转...',
                      duration:0
                    });
                    //设置菜单权限
                    this.$store.commit('updateMenulist');
                    // this.getBaseInfo();
                    this.getQiNiuToken();
                    setTimeout(()=>{
                     this.$router.push({name:'home'});
                   },1000)
                  }else{
                    this.$Message.error(res.data.msg);
                  }
                  iview.LoadingBar.finish();
                });

            }
          })
        },
        getQiNiuToken(){
          this.$http.get(`/base/qiniu/token`).then(res=>{
            if(res.data.code===0){
              let token = res.data.data.token;
              let qnPrefix=res.data.data.imagePrefix;
              localStorage.setItem('qnToken',token);
              localStorage.setItem('qnPrefix',qnPrefix)
            }
          })
        },
        /*getBaseInfo(){

          this.$http.get(`/user/basicInfo`).then(res=>{
            let menuList=[];
            if(res.data.code===0){
              let menu =res.data.data.resourceList.map(item=>{
                return item.path;
              });
              // order_filter
              let menuHasAdd = []; //用于存放已添加的菜单项name（外层）
              appRouter.forEach(item=>{
                let childRouter = item.children; //必然存在
                childRouter.forEach(child=>{
                  if(menu.indexOf(child.name)>-1){
                    item.meta.hideInMenu=false;
                    child.meta.hideInMenu=false;
                    if(menuHasAdd.indexOf(item.name)<0){
                      menuList.push(item);
                      menuHasAdd.push(item.name);
                    }
                  }else if(child.children&&child.children.length>0){

                    let ground=child.children;
                    ground.forEach(groundItem=>{
                      if(menu.indexOf(groundItem)>-1){
                        item.meta.hideInMenu=false;
                        child.meta.hideInMenu=false;
                        groundItem.meta.hideInMenu=false;
                        if(menuHasAdd.indexOf(item.name)<0){
                          menuList.push(item);
                          menuHasAdd.push(item.name);
                        }
                      }
                    })
                  }
                });

              });

              console.log(menuList);

              // console.log(menuList)
            }else{
              menuList=appRouter;
              console.log('菜单获取失败');
            }
            this.$store.commit('updateMenulist',menuList);
          });
        },*/
        iteratorRouter(obj,cb){
          if(obj instanceof Array){
            obj.forEach(item=>{
              typeof cb==='function'&&cb(item);
              if(item.children&&item.children.length>0){
                this.iteratorRouter(item.children,cb);
              }
            })
          }
        }

      },
      beforeDestroy(){
          this.loading();
      }
    }
</script>


