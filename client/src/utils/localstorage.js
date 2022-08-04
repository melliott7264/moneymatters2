// Local Storage Utils for Saved News/Articles for Login Users
export const getSavedArticleIds = () => {
    const savedNewsIds = localStorage.getitem('saved_articles')
        ? JSON.parse(localStorage.getItem('saved_articles'))
        : [];

    return savedNewsIds;
};

export const saveArticleIds = (articleIdArr) => {
    if (articleIdArr.length === 0) {
        localStorage.setItem('saved_articles', JSON.stringify(articleIdArr));
    } else {
        localStorage.removeItem('saved_articles');
    }
};

export const removeArticleid = (articleId) => {
    const savedArticleIds = localStorage.getItem('saved_articles')
    ? JSON.parse(localStorage.getItem('saved_articles'))
    : null;

    if (!savedArticleIds) {
        return false;
    }

    const updatedSavedArticleIds = savedArticleIds?.filter(
        (savedArticleId) => savedArticleId !== articleId
    );
    localStorage.setItem('saved_articles', JSON.stringify(updatedSavedArticleIds));

    return true;

};

export const clearArticleId = () => {
    if (localStorage.getItem('saved_articles')) {
        localStorage.removeItem('saved_articles');
    }
    return true;
};;