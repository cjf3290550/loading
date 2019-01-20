# loading
loading  animation 


# 使用方法

先引入js和css
<link rel="stylesheet" href="css/index.css">
<script src="js/index.js"></script>

然后直接调用loading方法
loading({
width: 6,
height: 6,
count: 3,
mask: false,
type: 'fade',
text: 'loading',
time: '30000',
bgColor: '#fff',
bar: false
})
    
    
# 参数说明

width: (可选) Number
loading框的宽度，单位：'rem',  默认6rem

height: (可选) Number
loading框的高度，单位：'rem', 默认6rem

count:  (可选) Number
动画圆点或条状的个数, 默认12

mask： (可选) Boolean
是否启用遮罩，默认false

type:  (可选) String
动画类型 共三种，'dot'、'fade'、'rotate'

text: (可选) String
loading框的文字 默认'loading'

time: (可选) Number
自动关闭动画的时间, ，单位：毫秒哦， 默认 30000

bgColor (可选) String
圆点或条形的背景颜色， 有mask 默认红色， 无mask默认白色

bar: (可选) Boolean
只在fade模式下生效，切换圆点还是条状的fade模式， 默认false
