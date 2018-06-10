<template>
    <div>
        <div class="ui fluid card">
            <div class="content">
                <div class="header"> {{ value.title }}</div>
            </div>
            <div class="content">
                <p>{{ value.content }}</p>
            </div>
            <div class="ui bottom attached buttons">
                <div class="ui button" id="commentBtn">
                    <i class="ui comment icon"></i>
                    comment
                </div>
                <div class="ui button" @click="updateLike">
                    <i :class="likeIcon"></i>
                    like
                    {{value.like}}
                </div>
                <!-- <div class="ui right floated positive button" @click="collectPost">收藏</div> -->
            </div>
            <div class="ui custom popup bottom left transition hidden" id="insertComment">
                <!-- <input type="text" name="" id=""> -->
                <textarea class="ui textarea" cols="30" rows="10" v-model="commentContent"></textarea>
                <!-- <br/> -->
                <button class="ui right floated primary button" @click="uploadComment">发送</button>
            </div>
            <!-- <div class="ui card"></div> -->
        </div>
        <div class="ui fluid card" v-for="comment in value.comments" :key="comment.id">
            <div class="content">
                <span>{{ comment.user }}</span>
            </div>
            <div class="content">
                {{ comment.content }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['value', 'getUsername'],
    data() {
        return {
            commentContent: '',
            likeIcon: 'ui like icon'
        }
    },
    methods: {
        uploadComment: function() {
            // $('#commentBtn').popup({
            //     popup: $('#insertComment'),
            //     on : 'click'
            // })
            $('#commentBtn').popup('hide')
            var self = this
            this.$ajax({
                method: 'post',
                url: 'api/uploadComment',
                data: {
                    username: this.getUsername,
                    content: this.commentContent,
                    postid: this.value.id
                },
                timeout: 3000
            }).then(function(response) {
                if (response.data['code'] === 0) {
                    self.value.comments.push({
                        id: response.data['id'],
                        user: self.getUsername,
                        content: self.commentContent
                    })
                    self.commentContent = ''
                }
            })
        },
        updateLike: function() {
            var self = this
            // this.value.like += 1
            this.$ajax({
                method: 'post',
                url: 'api/updateLikes',
                data: {
                    id: this.value.id
                }
            }).then(function(response) {
                if (response.data['code'] === 0) {
                    self.likeIcon = 'ui red like icon'
                    self.value.like += 1
                } else {
                    console.log('update likes code error');
                    
                }
            })
        }
    },
    watch: {
        "value.id" : function () {
            this.likeIcon = "ui like icon"
        }
    },
    mounted() {
        $('#commentBtn').popup({
                popup: $('#insertComment'),
                on : 'click'
        })
        this.likeIcon = 'ui like icon'
    }
}
</script>

