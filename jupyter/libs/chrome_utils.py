from datetime import datetime, timedelta
from dataclasses import dataclass
from typing import List
import configparser
import base64
import os
import chromedriver_binary
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from dotenv import load_dotenv
load_dotenv()


config = configparser.ConfigParser()
config.optionxform = str
config.read('config.ini')

# See: 
# https://chromedriver.chromium.org/capabilities
class ChromeUtils:
    def __init__(self, headless=True, use_proxy=False):
        self.use_proxy = use_proxy
        # ダウンロード先のファイル名を指定する
        self.options = Options()
        
        if headless:
            self.options.add_argument('--headless')
        
        if use_proxy:
            # http://username:password@127.0.0.1:8001
            # proxy_string = f'https://{PROXY["USER"]}:{PROXY["PASSWORD"]}@{PROXY["SERVER"]}:{PROXY["PORT"]}'
            # proxy_string = f"http://{username}:{password}@qiita.com/mochi_yu2/items/ce598ec57afe44453e98"
            # url = '{}:{}@{}'.format(ID, PW, URL)
            self.proxy_string = f'http://{os.environ["PROXY_SERVER"]}'
            self.options.add_argument(f'--proxy-server={self.proxy_string}')
            self.options.add_argument(f'--proxy-auth={os.environ["PROXY_USER"]}:{os.environ["PROXY_PASSWORD"]}')

        self.options.add_experimental_option('prefs', {
            'download.prompt_for_download': False,
            'download.directory_upgrade': True,
            'safebrowsing.enabled': True,
            'download.default_directory' : '/tmp/'
        })

    def get_auth_header(self):
        b64 = "Basic " + base64.b64encode('{}:{}'.format(os.environ["PROXY_USER"], os.environ["PROXY_PASSWORD"]).encode('utf-8')).decode('utf-8')
        return {"Authorization": b64}
        
    def initialize_driver(self):
        if self.use_proxy:
            return self.initialize_remote_driver()
        else:
            return self.initialze_normal_driver()
    
    def initialze_normal_driver(self):
        #  Example for chrome 4
        driver = webdriver.Chrome(
            service=ChromeService(ChromeDriverManager().install()), 
            options=self.options
        )

        # ウィンドウサイズを指定する
        driver.set_window_size(1280, 3000)
        return driver
    
    def initialize_remote_driver(self):
        capabilities= webdriver.DesiredCapabilities.CHROME.copy()
        capabilities['acceptInsecureCerts'] = True
        driver = webdriver.remote.webdriver.WebDriver(
            command_executor=self.proxy_string ,
            options=self.options
        )
        print(driver.capabilities)
        driver.add_credential(os.environ["PROXY_USER"], os.environ["PROXY_PASSWORD"])
        #driver.execute_cdp_cmd("Network.enable", {})
        #driver.execute_cdp_cmd("Network.setExtraHTTPHeaders", {"headers": self.get_auth_header()})
        return driver
