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
                <div class="ui button">comment</div>
                <div class="ui button">like</div>
            </div>
            
            <!-- <div class="ui card"></div> -->
        </div>
        <div class="ui fluid card" v-for="comment in value.comments" :key="comment.id">
            <div class="content">
                {{ comment }}
            </div>
            <div class="content">
                {{ comment.content }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['value'],
    data() {
        return {
        }
    }
}
</script>

