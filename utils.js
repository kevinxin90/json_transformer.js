/**
 * find the longest common path given an array of paths
 * @param {Array} paths - an array of paths (e.g. go.BP.id)
 * @returns - the longest common path(separated by dot)
 */
function findLongestCommonPath(paths) {
    let new_paths = [];
    for (let item of paths) {
        if (typeof item !== "string") {
            return null
        } else {
            new_paths.push(item.split('.'));
        }
    }
    if (new_paths.length === 1) {
        return paths[0]
    } else if (new_paths.length === 0) {
        return null
    }
    let common_path = [];
    let eql;
    for (let i = 0; i < new_paths[0].length; i++) {
        eql = false;
        for (let item of new_paths) {
            if (item[i] && item[i] === new_paths[0][i]) {
                eql = true;
            } else {
                eql = false;
            }
        }
        if (eql) {
            common_path.push(new_paths[0][i]);
        } else {
            break;
        }
    }
    if (common_path.length === 0) {
        return null;
    } else {
        return (common_path.join('.'));
    }
}

exports.findLongestCommonPath = findLongestCommonPath;