import pyautogui
import time
import random
import string
import winsound

a = random.random()
b = random.random()
random_letter = random.choice(string.ascii_letters)

def Letter_gen():

  while True:
    a = random.choice(string.ascii_lowercase)
    b = random.choice(string.ascii_lowercase)
    c = random.choice(string.ascii_lowercase)
    d = random.choice(string.ascii_lowercase)
    e = random.choice(string.ascii_lowercase)
    f = random.choice(string.ascii_lowercase)
    g = random.choice(string.ascii_lowercase)
    k = random.choice(string.ascii_uppercase)

    letter_list = [a, b, c, d, e, f, g, k]

    pyautogui.typewrite(random.choice(letter_list))
    time.sleep(random.uniform(1,110))
    pyautogui.press('backspace')
    time.sleep(random.uniform(1,10))

    #hhelhfadufhk hbdkfhvlskdjfhblsidhvb .skflwkdflalshdhgvlajsgvavsh,qHwg



def counter_bell():

  while True:
    time.sleep(110)
    winsound.Beep(500, 600)
    time.sleep(10)
    





def main():
  Letter_gen()

#hdrgfdhfgm



main()


