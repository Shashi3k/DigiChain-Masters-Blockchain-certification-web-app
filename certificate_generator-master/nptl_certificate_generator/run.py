import os
import cv2
import pandas as pd

list_of_names = []
course_dura=[]
assign=[]
payment=[]
pass_grade=[]


def delete_old_data():
    for i in os.listdir("nptl_certificate_generator/certificates/"):
        os.remove("nptl_certificate_generator/certificates/{}".format(i))


def cleanup_data():
    df=pd.read_csv("nptl_certificate_generator/NPTEL_input.csv")
    list_of_names=list(df.iloc[:,0])
    course_dura=list(df.iloc[:,1])
    assign=list(df.iloc[:,2])
    pass_grade=list(df.iloc[:,3])
    payment=list(df.iloc[:,4])
    generate_certificates(list_of_names,course_dura,assign,pass_grade,payment)
    # with open('name-list.txt') as f:
    #     for line in f:
    #         list_of_names.append(line.strip())
    # with open('marks-list.txt') as f:
    #     for line in f:
    #         marks_list.append(line.strip())


def generate_certificates(l,c,a,pas,p):
    img = cv2.imread('certificate-template.jpg')
    pass_check=['A','B']
    for index, name in enumerate(l):
        if(c[index]>=4 and a[index]=='yes' and (pas[index] in pass_check) and p[index]=='yes'):
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
