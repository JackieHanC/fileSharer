<template>
    <div>
        <div class="ui fluid card">
            <div class="content">
                <div class="header"> {{ post.title }}</div>
            </div>
            <div class="content">
                <p>{{ post.content }}</p>
            </div>
            <div class="ui bottom attached buttons">
                <div class="ui button">comment</div>
                <div class="ui button">like</div>
            </div>
            <div class="ui card" v-for="comment in post.comments" :key="comment.id">
                <div class="content">
                    {{ comment.user }}
                </div>
                <div class="content">
                    {{ comment.content }}
                </div>
            </div>
            <!-- <div class="ui card"></div> -->
        </div>
    </div>
</template>

<script>
export default {
    props: ['value'],
    data() {
        return {
            post: this.value
        }
    }
}
</script>

