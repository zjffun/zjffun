import Bmob from 'hydrogen-js-sdk';

export const logError = (err, info = '') => {
  // init （这是什么鬼，key 放 JS 里直接不就被大家都看到了么。。）
  Bmob.initialize(
    '27da0a32a5a45376cbfb2998d87a1939',
    '9213782b1869343159b229f71da412e3'
  );

  // insert
  const query = Bmob.Query('ttt');
  query.set('err', {
    columnNumber: err.columnNumber,
    fileName: err.fileName,
    lineNumber: err.lineNumber,
    message: err.message,
    stack: err.stack
  });
  query.set('info', info);
  query.save();
};
