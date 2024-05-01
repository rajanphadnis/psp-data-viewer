import gdown

# a file
# url = "https://drive.google.com/uc?id=1l_5RK28JRL19wpT22B-DY9We3TVXnnQQ"
# output = "fcn8s_from_caffe.npz"
# gdown.download(url, output)


output = "C:\\Users\\rajan\\Desktop\\psp-platform\\functions\\test_small.tdms"
url = "https://drive.google.com/file/d/1-K6kYFNGwkccVDpCWeNJHEILtO-naTVs/view?usp=sharing"
url_big = "https://drive.google.com/file/d/1Fqfqqwd9GL9sjCOnsgoKou55RBKDQs6L/view?usp=drive_link"
thing = gdown.download(url=url_big, output=output, fuzzy=True)
print("done")