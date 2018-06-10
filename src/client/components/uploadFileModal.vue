<template>
    <div class="ui form">
        <div class="field">
            <label>标题</label>
            <input type="text" class="ui input" v-model="title" placeholder="请输入标题">
        </div>
        <div class="two fields">
            <div class="field">
                <label>专业</label>
                <div class="ui float search selection dropdown" id="majorDropdown2">
                    <input type="hidden">
                    <i class="dropdown icon"></i>
                    <div class="default text">专业</div>
                    <div class="menu">
                        <div class="item" v-for="major in majorList" :key="major">{{major}}</div>
                    </div>
                </div>
            </div>
            <div class="field">
                <label>课程</label>
                <div class="ui float search selection dropdown" id="courseDropdown2">
                    <input type="hidden">
                    
                    <i class="dropdown icon"></i>
                    <div class="default text">课程</div>
                    <div class="menu">
                        <div class="item" v-for="course in courseList" :key="course">{{course}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="field">
            <label>文件</label>
            <input type="file" id="inputFile" @change="uploadFile">
        </div>
        <div class="field">
            <div :class="btnStyle" @click="updateFileInfo">上传</div>
        </div>
    </div>
</template>

<script>

export default {
    props: ['btnStyle'],
    data() {
        return {
            majorList: [],
            courseList: [],
            title: '',
            fileID: '',
            // buttonStyle: "ui disabled fluid primary button"
        }
    },
    methods: {
        selectMajor: function() {
            var self = this
            console.log($('#majorDropdown2').dropdown('get text'));
            
            this.$ajax({
                method: 'post',
                url: 'api/getCourse',
                data: {
                    major: $('#majorDropdown2').dropdown('get text')
                },
                timeout: 3000
            }).then(function(response) {
                if (response.data['code'] === 0) {
                    self.courseList = [].concat(response.data['courselist'])
                } else {
                    console.log('get course code error');    
                }
            })
        },
        uploadFile: function () {
            var f = document.getElementById('inputFile').files[0]
            // console.log(f);
            var formdata = new FormData();
            formdata.append('file', f);
            // formdata.append('title', this.title)
            // formdata.append('major', $('#majorDropdown2').dropdown('get text'));
            // formdata.append('course', $('#courseDropdown2').dropdown('get text'))
            

            
            
            
            var self = this
            this.$ajax({
                method: 'post',
                url: 'api/uploadFile',
                data: formdata,
                cache: false,
                processData: false,
                data: formdata,
                contentType: false
            }).then(function(response) {
                if (response.data['code'] === 0) {
                    console.log('upload file code 0');
                    console.log('upload file id' + response.data['id']);
                    
                    self.fileID = response.data['id']
                    self.$emit("changestyle", "ui fluid primary button");
                }
            })
        },
        updateFileInfo: function () {
            var self = this
            this.$ajax({
                method: 'post',
                url: 'api/updataFileInfo',
                data: {
                    id: this.fileID,
                    major: $('#majorDropdown2').dropdown('get text'),
                    course: $('#courseDropdown2').dropdown('get text'),
                    title: this.title
                },
                timeout: 3000
            }).then(function(response) {
                self.$emit('close')
                if (response.data['code'] === 0) {

                } else {
                    console.log('updateFileInfo code error');
                }
            })
        }
    }
    ,
    mounted() {
        $('#courseDropdown2').dropdown();
        $('#majorDropdown2').dropdown({
            onChange: this.selectMajor
        });

        var self = this
        this.$ajax({
            url: 'api/getMajor',
            method: 'post',
            data: {

            },
            timeout: 3000
        }).then(function(response) {
            if (response.data['code'] === 0) {
                self.majorList = [].concat(response.data['majorlist'])
                console.log('major list length ' + self.majorList.length);
            } else {
                console.log('getMajor code error');  
            }
        })

    }
}
</script>

