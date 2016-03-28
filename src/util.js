var trace = x => {
    console.log(x);

    return x;
};

var noop = x => {};

module.exports = {
	trace : trace
	, noop : noop
};
