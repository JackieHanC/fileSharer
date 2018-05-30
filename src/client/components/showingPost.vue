<template>
    <div>
        <div class="ui fluid card">
            <div class="content">
                <div class="header"> {{thePost.title}}</div>
            </div>
            <div class="content">
                <p>{{ thePost.content }}</p>
            </div>
            <div class="ui bottom attached buttons">
                <div class="ui button">comment</div>
                <div class="ui button">like</div>
            </div>

            <!-- <div class="ui card"></div> -->
        </div>
    </div>
</template>

<script>
export default {
    props: ['thePost'],
    data() {
        return {
            post: this.thePost
        }
    }
}
</script>

