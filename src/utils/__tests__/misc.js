/* eslint-disable no-undef */
import formatDate from '../misc';

test('Formating date test', () => {
  expect(formatDate(new Date('November 07, 2000'))).toBe('Nov 00');
});
