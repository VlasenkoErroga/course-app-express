function breadcrumbsFn(path, parentPath){
    const breadcrumbs = {
        items: []
    }
    

    return breadcrumbs.items.concat([{title: 'home', url: '/'}, { title: path, url: path}, {title: parentPath, url: parentPath.toString}])
}

module.exports = breadcrumbsFn