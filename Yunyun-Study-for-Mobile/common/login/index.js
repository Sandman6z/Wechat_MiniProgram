import store from '../../store' 
import { request } from '../request/index.js'
import { formatTime } from '../../utils/timeFormat.js'
/**
 * 登录
 * @param {object} loginData 登录输入数据
 * @param {boolean} isStorage 是否存入缓存
 * @param {function} correctBack 返回正确
 * @param {function} wrongBack 返回错误
 * return Pomise
 */
export const login = params => {
	return request({
	   url: '/last/user/login',
	   method: 'POST',
	   data:JSON.stringify(params.loginData),
	   header:{
		   'Content-Type':'application/json'
	   },
	   showLoading:true,
	  },false).then(res => { 
			if(res.data.status ? res.data.data['truepass'] :false){
					let userInfo = res.data.data;
					params.correctBack();
					// that.tipText = ''
					// console.log('登录成功');
					
					//获取当前时间,并写入
					userInfo['loginTime'] = formatTime(new Date());
					if(params.isStorage){
						//存入用户缓存
						uni.setStorageSync('userInfo', userInfo);
						//vuex获取缓存
						store.commit('common/getUserInfo');
					}else{
						//一次性登录
						store.commit('common/changeUserInfo',userInfo)
					}
					//登录成功提示
					uni.showToast({
					    title: '登录成功,跳转至登录页面',
						icon: 'none',
						duration: 900
					});
					//获取 购物车和优惠券信息 
					store.dispatch('cart/request_cart').then(() => {
						setTimeout( () => {
							//跳转到首页
							uni.switchTab({
								url: '/pages/index/index'
							});
						}, 1000);
					})
				}else{
				params.wrongBack();
			}
	})
}