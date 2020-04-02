<template>
  <div>
    <textarea :id="Id" :value="content"></textarea>
  </div>
</template>
<script>
  require('../../../static/tinymce/zh_CN.js'); // 根据自己的组件路径修改
  export default {
    name:'tinymce',
    data () {
      const Id = Date.now();
      return {
        domain:'',
        qiniuToken:{
          token:''
        },
        Id: Id,
        Editor: null,
        DefaultConfig: {
          auto_focus:true,
          branding: false,
          height: 500,
          theme: 'silver',
          menubar: true,
          menu: {
            edit: {title: '编辑', items: 'undo redo | cut copy paste pastetext | selectall'},
            insert: {title: '插入', items: 'link media | template hr'},
            view: {title: '查看', items: 'visualaid'},
            format: {title: '格式', items: 'bold italic underline strikethrough superscript subscript | formats | removeformat'},
            table: {title: '表格', items: 'inserttable tableprops deletetable | cell row column'},
          },
          toolbar: `styleselect | fontselect | formatselect | fontsizeselect | forecolor backcolor | bold italic underline strikethrough | image  media | table | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | preview removeformat  hr | paste code  link | undo redo | fullscreen `,
          plugins: `
            paste
            importcss
            image
            code
            table
            advlist
            fullscreen
            link
            media
            lists
            textcolor
            colorpicker
            hr
            preview
          `,
          // CONFIG
          readonly : false,
          forced_root_block: 'p',
          force_p_newlines: true,
          importcss_append: true,
          automatic_uploads: true,
          // CONFIG: ContentStyle 这块很重要， 在最后呈现的页面也要写入这个基本样式保证前后一致， `table`和`img`的问题基本就靠这个来填坑了
          content_style: `
            *                         { padding:0; margin:0; }
            html, body                { height:100%; }
            img                       { max-width:100%; display:block;height:auto; }
            a                         { text-decoration: none; }
            iframe                    { width: 100%; }
            p                         { line-height:1.6; margin: 0px; }
            table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
            .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
            ul,ol                     { list-style-position:inside; }
          `,
          images_upload_url: `https://up.qbox.me/`,
          images_upload_base_path: '',
          insert_button_items: 'image link | inserttable',
          images_upload_credentials: false,
          image_title: false,
          // CONFIG: Paste
          paste_retain_style_properties: 'all',
          paste_word_valid_elements: '*[*]',        // word需要它
          paste_data_images: true,                  // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
          paste_convert_word_fake_lists: false,     // 插入word文档需要该属性
          paste_webkit_styles: 'all',
          paste_merge_formats: true,
          nonbreaking_force_tab: false,
          paste_auto_cleanup_on_paste: false,
          // CONFIG: Font
          fontsize_formats: '10px 11px 12px 14px 16px 18px 20px 24px',
          // CONFIG: StyleSelect
          style_formats: [
            {
              title: '首行缩进',
              block: 'p',
              styles: { 'text-indent': '2em' }
            },
            {
              title: '行高',
              items: [
                {title: '1', styles: { 'line-height': '1' }, inline: 'span'},
                {title: '1.5', styles: { 'line-height': '1.5' }, inline: 'span'},
                {title: '2', styles: { 'line-height': '2' }, inline: 'span'},
                {title: '2.5', styles: { 'line-height': '2.5' }, inline: 'span'},
                {title: '3', styles: { 'line-height': '3' }, inline: 'span'}
              ]
            }
          ],
          // FontSelect
          font_formats: `
            微软雅黑=微软雅黑;
            宋体=宋体;
            黑体=黑体;
            仿宋=仿宋;
            楷体=楷体;
            隶书=隶书;
            幼圆=幼圆;
            Andale Mono=andale mono,times;
            Arial=arial, helvetica,
            sans-serif;
            Arial Black=arial black, avant garde;
            Book Antiqua=book antiqua,palatino;
            Comic Sans MS=comic sans ms,sans-serif;
            Courier New=courier new,courier;
            Georgia=georgia,palatino;
            Helvetica=helvetica;
            Impact=impact,chicago;
            Symbol=symbol;
            Tahoma=tahoma,arial,helvetica,sans-serif;
            Terminal=terminal,monaco;
            Times New Roman=times new roman,times;
            Trebuchet MS=trebuchet ms,geneva;
            Verdana=verdana,geneva;
            Webdings=webdings;
            Wingdings=wingdings,zapf dingbats`,

          // Tab
          tabfocus_elements: ':prev,:next',
          object_resizing: true,

          // Image
          imagetools_toolbar: 'rotateleft rotateright | flipv fliph | editimage imageoptions'
        }
      }
    },
    props: {
      content: {
        default: '',
        type: String
      },
      config: {
        type: Object,
        default: () => {
          return {
            theme: 'modern',
            height: 300
          }
        }
      },
      url: {
        default: '',
        type: String
      },
      accept: {
        default: 'image/jpeg, image/png,image/jpg',
        type: String
      },
      maxSize: {
        default: 2097152,
        type: Number
      },
      withCredentials: {
        default: false,
        type: Boolean
      }
    },
    watch:{
      content:{
        handler(newValue, oldValue){
          tinyMCE.activeEditor.setContent(newValue);
        },
        deep:true
      }
    },
    headers: {
      'Content-type': 'application/json;charset=UTF-8'
    },
    mounted () {
      this.getToken();
      this.init()
    },
    // beforeDestroy () {
    //   // 销毁tinymce
    //   this.$emit('on-destroy')
    //   window.tinymce.remove(document.getElementById(`{this.Id}`))
    // },
    methods: {
      getToken(){
        this.$http.get(`/base/qiniu/token`).then(res=>{
          if (res.data.code === 0){
            this.domain = res.data.data.domain;
            this.qiniuToken.token = res.data.data.token;
          }
        })
      },
      init () {
        const self = this;
        this.Editor = window.tinymce.init({
          // 默认配置
          ...this.DefaultConfig,
          // 图片上传
          images_upload_handler: function (blobInfo, success, failure) {
            if (blobInfo.blob().size > self.maxSize) {
              failure('文件体积过大')
            }
            if (self.accept.indexOf(blobInfo.blob().type) >= 0) {
              uploadPic(blobInfo.blob())
            } else {
              failure('图片格式错误')
            }
            function uploadPic () {
              const formData = new FormData();
              formData.append('file', blobInfo.blob(), blobInfo.filename());
              formData.append('token',self.qiniuToken.token);
              self.$http.post(`https://up.qbox.me/`,formData,{withCredentials: false}).then(res=>{
                if(res.status == 200){
                  // 抛出 'on-upload-complete' 钩子
                  let imgUrl = self.domain+ res.data.key;
                  success(imgUrl);
                  self.$emit('on-upload-complete')
                }else{
                  self.$emit('on-upload-fail')
                  // failure('上传失败: ' + xhr.status)
                }
              })
            }
          },
          // prop内传入的的config
          ...this.config,

          // 挂载的DOM对象
          selector: `#${this.Id}`,
          setup: (editor) => {
            // 抛出 'on-ready' 事件钩子
            editor.on(
              'init', () => {
                self.$emit('on-ready');
                editor.setContent(self.content)
              }
            );
            // 抛出 'input' 事件钩子，同步value数据
            editor.on(
              'input change undo redo', () => {
                self.$emit('input', editor.getContent())
              }
            )
          }
        })
      },
      getContent () {
        // console.log(9999,tinymce.editors[0].getContent())
      }
    }
  }
</script>
