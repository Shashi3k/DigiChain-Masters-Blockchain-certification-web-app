import os
import cv2
import pandas as pd

list_of_names = []
pass_or_fail=[]
attendance=[]
payment=[]
practical=[]


def delete_old_data():
    for i in os.listdir("certificates/"):
        os.remove("certificates/{}".format(i))


def cleanup_data():
    df=pd.read_csv("Book1.csv")
    list_of_names=list(df.iloc[:,0])
    practical=list(df.iloc[:,7])
    pass_or_fail=list(df.iloc[:,9])
    payment=list(df.iloc[:,8])
    attendance=list(df.iloc[:,6])
    print(list_of_names)
    print(practical)
    print(pass_or_fail)
    print(payment)
    print(attendance)
    generate_certificates(list_of_names,pass_or_fail,payment,attendance,practical)
    # with open('name-list.txt') as f:
    #     for line in f:
    #         list_of_names.append(line.strip())
    # with open('marks-list.txt') as f:
    #     for line in f:
    #         marks_list.append(line.strip())


def generate_certificates(l,p,pay,at,prac):
    img = cv2.imread('certificate-template.jpg')
    for index, name in enumerate(l):
        if(p[index]=='pass' and int(at[index])>=75 and pay[index]=='yes' and prac[index]=='pass'):
            cimg=cv2.imread('certificate-template.jpg')
            font = cv2.CAP_PROP_XI_TIMEOUT
            font_scale = 2
            thickness = 3
            text_size, _ = cv2.getTextSize(str(name.strip()), font, font_scale, thickness)
            text_x = (img.shape[1] - text_size[0]) // 2
            text_y = (img.shape[0] + text_size[1]) // 2
            print(text_x,text_y)
            cv2.putText(cimg, name.strip(), (text_x,text_y), font, font_scale, (36, 36, 36), thickness,
                    cv2.LINE_AA)
            cv2.imwrite("certificates/{}.jpg".format(name.strip()), cimg)
            print("Processing {} / {}".format(index + 1, len(list_of_names)))


def main():
    delete_old_data()
    cleanup_data()


if __name__ == '__main__':
    main()
