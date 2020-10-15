// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';
import url from 'url';
import mockData from './features/cards/cardsData.json';
import mockDataP2 from './features/cards/cardsData2.json';
import mockDataNameFoo from './features/cards/cardsDataNameFoo.json';

fetchMock.enableMocks();
fetch.mockResponse(req => {
  const { page, name } = url.parse(req.url, true).query;

  if (name === 'foo') {
    return Promise.resolve(JSON.stringify(mockDataNameFoo));
  }

  switch(page) {
    case '1':
      return Promise.resolve(JSON.stringify(mockData));
    case '2':
      return Promise.resolve(JSON.stringify(mockDataP2));
    default:
      return Promise.resolve('{"cards":[],"_pageSize":20,"_totalCount":40}');
  }
});

