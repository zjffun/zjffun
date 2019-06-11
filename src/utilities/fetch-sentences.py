# get sentences
import os
import requests
import json
import time
from bs4 import BeautifulSoup
from random import randint

headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:67.0) Gecko/20100101 Firefox/67.0',
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2",
  "Accept-Encoding": "gzip, deflate, br",
  "Connection": "keep-alive",
  'Host':'www.juzimi.com',
  'Referer':'http://www.juzimi.com/article/'
}


url = 'http://www.juzimi.com/article/297039?page='
# url = "http://www.baidu.com?page="
page_num = 14

def get_html(url):
  r = requests.get(url, headers = headers)
  html = r.content
  return html


def get_juzi(html):
  result = []
  soup = BeautifulSoup(html, "html.parser")
  juzilist = soup.find_all('div', class_="views-field-phpcode")
  for sentence in juzilist:
    # print(sentence.find('a', class_="xlistju"))
    c = sentence.find('a', class_="xlistju")
    w = sentence.find('a', class_="views-field-field-oriwriter-value")
    if c and w and len(c.get_text()) < 128:
       result.append({
        'content': c.get_text(),
        'writer': w.get_text()
      })
  return result

if __name__ == '__main__':
  sentences = []
  for item in range(page_num):
    current_rul = url + str(item)
    html = get_html(current_rul)
    sentences = sentences + get_juzi(html)
    print(current_rul + '---' + str(len(sentences)))
    time.sleep(randint(30, 60))

  # save sentences in file
  fo = open(os.path.abspath(os.path.join(__file__, "../../sentences/rewrite.json")), "w")
  fo.write(json.dumps(sentences))

