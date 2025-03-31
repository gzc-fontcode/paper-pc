/**
 * 防抖函数
 * @param {Function} func - 要进行防抖处理的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} - 返回一个经过防抖处理的函数
 */
export function debounce(func, delay) {
    let timer = null;
    return function (...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要进行节流处理的函数
 * @param {number} limit - 时间间隔（毫秒）
 * @returns {Function} - 返回一个经过节流处理的函数
 */
export function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
    