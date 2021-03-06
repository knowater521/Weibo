﻿//微博部分

//微博API
//显示所有weibo的API
let apiWeiboAll = function (callback) {
    let path = '/api/weibo/all';
    ajax('GET', path, '', callback)
};

//发表微博的API
let apiWeiboAdd = function (form, callback) {
    let path = '/api/weibo/add';
    ajax('POST', path, form, callback)
};

//删除微博的API
let apiWeiboDelete = function (weibo_id, callback) {
    let path = `/api/weibo/delete?id=${weibo_id}`;
    ajax('GET', path, '', callback)
};

//更新微博的API
let apiWeiboUpdate = function (form, callback) {
    let path = '/api/weibo/update';
    ajax('POST', path, form, callback)
};

//微博模板
let weiboTemplate = function (weibo) {
    let t = `
        <div class="weibo-cell pure-form" data-id="${weibo.id}">
            <span class="weibo-user pure-u-3-5">${weibo.writer}发表了微博[${weibo.update_time}]:</span>
            <span class="btn-small">
                <button class="weibo-delete link-style pure-button pure-u-1-8">删除</button>
                <button class="weibo-edit link-style pure-button pure-u-1-8">编辑</button>
            </span>
            <p class="weibo-content">${weibo.content}</p>
            <div class="weibo-cell-end"></div>
            <input class='input-style input-comment pure-u-3-5'>
            <button class="button-add-comment link-style pure-button pure-u-1-5">添加评论</button>
        </div>
    `;
    return t
};

//用于更新微博的模板
let weiboUpdateTemplate = function (title) {
    let t = `
        <div class="weibo-update-form">
            <input class="input-style weibo-update-input pure-u-1-2" value="${title}">
            <button class="weibo-update pure-button">更新</button>
        </div>
    `;
    return t
};

//插入每个微博区块
let insertWeibo = function (weibo) {
    let weiboCell = weiboTemplate(weibo);
    // 插入 weibo-list
    let weiboList = e('#id-weibo-list');
    weiboList.insertAdjacentHTML('afterbegin', weiboCell)
};

//插入更新微博的区块
let insertUpdateForm = function (title, weiboCell) {
    let updateForm = weiboUpdateTemplate(title);
    let insertPoint = e('.weibo-cell-end', weiboCell);
    insertPoint.insertAdjacentHTML('beforebegin', updateForm)
};

//加载所有微博数据
let loadWeibos = function () {
    apiWeiboAll(function (weibos) {
        log('load all weibos', weibos);
        for (let i = 0; i < weibos.length; i++) {
            let weibo = weibos[i];
            insertWeibo(weibo)
        }
        loadComments()
    })
};

//实现添加微博的功能
let bindEventWeiboAdd = function () {
    let b = e('#id-button-add');
    b.addEventListener('click', function () {
        let input = e('#id-input-weibo');
        let title = input.value;
        log('You input the weibo', title);

        // 判断一下内容是否为空
        if (title.length == 0) {
            alert("微博内容不能为空");
        } else {
            input.value = "";
            let form = {
                content: title
            };
            apiWeiboAdd(form, function (weibo) {
                // 收到返回的数据, 插入到页面中
                insertWeibo(weibo)
            })
        }

    })
};

//实现删除微博的功能
let bindEventWeiboDelete = function () {
    let weiboList = e('#id-weibo-list');
    // 事件委托
    weiboList.addEventListener('click', function (event) {
        let self = event.target;
        if (self.classList.contains('weibo-delete')) {
            log('点到了删除按钮');
            let weiboId = self.closest('.weibo-cell').dataset['id'];

            //传输被删除的Weibo的I
            apiWeiboDelete(weiboId, function (r) {
                log('apiWeiboDelete', r.message);
                self.closest('.weibo-cell').remove();
                alert(r.message)
            })
        }
    })
};

//实现编辑微博的功能
let bindEventWeiboEdit = function () {
    let weiboList = e('#id-weibo-list');
    weiboList.addEventListener('click', function (event) {
        // self is the one clicked
        let self = event.target;
        log(self.classList);
        if (self.classList.contains('weibo-edit')) {
            log('点到了编辑按钮');
            let weiboCell = self.closest('.weibo-cell');
            if (e('.weibo-update-form', weiboCell) == null) {
                let weiboId = weiboCell.dataset['id'];
                let weiboSpan = e('.weibo-content', weiboCell);
                let title = weiboSpan.innerText;
                insertUpdateForm(title, weiboCell)
            }

        }
    })
};

//实现更新微博的功能
let bindEventWeiboUpdate = function () {
    let weiboList = e('#id-weibo-list');
    weiboList.addEventListener('click', function (event) {
        let self = event.target;
        log(self.classList);
        if (self.classList.contains('weibo-update')) {
            log('点到了更新按钮');
            let weiboCell = self.closest('.weibo-cell');
            let weiboId = weiboCell.dataset['id'];
            log('update weibo id', weiboId);
            let input = e('.weibo-update-input', weiboCell);
            let title = input.value;
            let form = {
                id: weiboId,
                content: title,
            };

            apiWeiboUpdate(form, function (weibo) {
                // 收到返回的数据, 插入到页面中
                let weiboSpan = e('.weibo-content', weiboCell);
                weiboSpan.innerText = weibo.content;

                let updateForm = e('.weibo-update-form', weiboCell);
                updateForm.remove()
            })
        }
    })
};


//评论部分
//显示所有评论的API
let apiCommentAll = function (callback) {
    let path = '/api/comment/all';
    ajax('GET', path, '', callback)
};

//发表评论的API
let apiCommentAdd = function (form, callback) {
    let path = '/api/comment/add';
    ajax('POST', path, form, callback)
};

//删除评论的API
let apiCommentDelete = function (comment_id, callback) {
    let path = `/api/comment/delete?id=${comment_id}`;
    ajax('GET', path, '', callback)
};

//更新评论的API
let apiCommentUpdate = function (form, callback) {
    let path = '/api/comment/update';
    ajax('POST', path, form, callback)
};

//评论块的模板
let commentTemplate = function (comment) {
    let t = `
    <div class="comment-cell" data-id="${comment.id}" data-weiboId="${comment.weibo_id}">
        <span class="comment-user"> [评论]-${comment.update_time}-\n ${comment.writer}:</span>
        <span class="comment-title">${comment.content}</span>
        <button class="comment-delete">删除</button>
        <button class="comment-edit">编辑</button>
        <div class="comment-cell-end"></div>
    </div>
    `;
    return t
};

//更新评论的输入框
let commentUpdateTemplate = function (title) {
    let t = `
        <div class="comment-update-form">
            <input class="comment-update-input" value="${title}">
            <button class="comment-update">更新</button>
        </div>
    `;
    return t
};

//插入评论块
let insertComment = function (comment) {
    let commentCell = commentTemplate(comment);
    let weiboList = document.querySelectorAll(".weibo-cell");
    for (let i = 0; i < weiboList.length; i++) {
        if (comment.weibo_id == weiboList[i].dataset["id"]) {
            log('加载评论', comment.content, '微博ID', comment.weibo_id);
            let insertPoint = e(".weibo-cell-end", weiboList[i]);
            insertPoint.insertAdjacentHTML('beforeend', commentCell)
        }
    }
};

//插入更新评论块
let insertUpdateCommentForm = function (title, commentCell) {
    let updateForm = commentUpdateTemplate(title);
    log(commentCell);
    let insertPoint = e('.comment-edit', commentCell);
    insertPoint.insertAdjacentHTML('afterend', updateForm)
};

//加载评论
let loadComments = function () {
    apiCommentAll(function (comments) {
        log('load all comments', comments);
        for (let i = 0; i < comments.length; i++) {
            let comment = comments[i];
            insertComment(comment)
        }
    })
};

//实现添加评论
let bindEventCommentAdd = function () {
    let b = e('#id-weibo-list');
    b.addEventListener('click', function (btn) {
        self = btn.target;
        if (self.classList.contains('button-add-comment')) {
            let weiboCell = self.closest('.weibo-cell');
            let input = e('.input-comment', weiboCell);
            let content = input.value;
            input.value = "";
            log('click add', content);
            let form = {
                weibo_id: weiboCell.dataset['id'],
                content: content
            };
            apiCommentAdd(form, function (comment) {
                // 收到返回的数据, 插入到页面中
                insertComment(comment)
            })
        }
    })
};

//实现删除评论
let bindEventCommentDelete = function () {
    let b = e('#id-weibo-list');
    b.addEventListener('click', function (btn) {
        let self = btn.target;
        if (self.classList.contains('comment-delete')) {
            log('点到了删除按钮');
            let commnetId = self.parentElement.dataset['id'];
            apiCommentDelete(commnetId, function (r) {
                log('apiWeiboDelete', r.message);
                self.parentElement.remove();
                alert(r.message)
            })
        }
    })
};

//实现编辑功能
let bindEventCommentEdit = function () {
    let b = e('#id-weibo-list');
    b.addEventListener('click', function (btn) {
        let self = btn.target;
        if (self.classList.contains('comment-edit')) {
            log('点到了编辑按钮');
            let commentCell = self.closest('.comment-cell');
            let commentId = commentCell.dataset['id'];
            let commentSpan = e('.comment-title', commentCell);
            let title = commentSpan.innerText;
            insertUpdateCommentForm(title, commentCell)
        }
    })
};

//实现更新评论
let bindEventCommentUpdate = function () {
    let b = e('#id-weibo-list');
    b.addEventListener('click', function (btn) {
        let self = btn.target;
        if (self.classList.contains('comment-update')) {
            log('点到了更新按钮');
            let commentCell = self.closest('.comment-cell');
            let commentId = commentCell.dataset['id'];
            let input = e('.comment-update-input', commentCell);
            let title = input.value;
            let form = {
                id: commentId,
                content: title,
            };

            apiCommentUpdate(form, function (comment) {
                // 收到返回的数据, 插入到页面中
                let commentSpan = e('.comment-title', commentCell);
                commentSpan.innerText = comment.content;

                let updateForm = e('.comment-update-form', commentCell);
                updateForm.remove()
            })
        }
    })
};


// Main Function
let bindWeiboEvents = function () {
    bindEventWeiboAdd();
    bindEventWeiboDelete();
    bindEventWeiboEdit();
    bindEventWeiboUpdate()
};

let bindCommentEvents = function () {
    bindEventCommentAdd();
    bindEventCommentDelete();
    bindEventCommentEdit();
    bindEventCommentUpdate()
};

let __main = function () {
    bindWeiboEvents();
    bindCommentEvents();
    loadWeibos()
};

__main();
