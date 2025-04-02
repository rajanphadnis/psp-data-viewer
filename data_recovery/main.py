import pandas as pd
from methods import TheSomewhatAccurateTimeseriesAligner
from process import createDFList


def align():
    # read files into dataframes
    dfs: list[pd.DataFrame] = createDFList(
        [
            "bcls_pts.mat",
            "bcls_tcs.mat",
            # "bcls-pts.txt",
            # "bcls-pts2.txt",
            # "fms.txt",
            # "even_more_pts.mat",
        ]
    )
    # print("dfs")
    # print(len(dfs))

    # create aligner class
    aligner = TheSomewhatAccurateTimeseriesAligner(dfs)

    # align with cross correlation (can't believe I remembered this from Garrison)
    aligned_dfs = aligner.align_by_correlation()

    print(aligned_dfs)
    # plot for confirmation
    # aligner.plot_aligned_data()

    # merge DFs
    merged_df = aligner.merge_aligned_dataframes()
    # print(merged_df)


align()
