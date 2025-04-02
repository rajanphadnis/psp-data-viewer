import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import correlate


class TheSomewhatAccurateTimeseriesAligner:
    def __init__(self, dataframes: list[pd.DataFrame]):
        self.dataframes = dataframes
        self.aligned_dataframes: list[pd.DataFrame] = []

    def _cross_correlate_columns(self, series1: pd.Series, series2: pd.Series) -> float:
        """
        Perform cross-correlation to find (guess) time shift/delta between two series.
        """
        # get norm for each channel
        series1_norm = (series1 - series1.mean()) / series1.std()
        series2_norm = (series2 - series2.mean()) / series2.std()

        # cross-correlate using scipy
        correlation = correlate(series1_norm, series2_norm, mode="full")

        # calc lag using max correlation
        lag = correlation.argmax() - (len(series1_norm) - 1)
        return lag

    def align_by_correlation(self) -> list[pd.DataFrame]:
        """
        Align dataframes by finding optimal time shifts using cross-correlation.
        """
        aligned_dfs: list[pd.DataFrame] = []

        for i, df1 in enumerate(self.dataframes):
            for j, df2 in enumerate(self.dataframes):
                if i >= j:  # Avoid duplicate pairs and self-comparison
                    continue
                if df1.columns.equals(df2.columns):  # Ensure column names match
                    # Calculate sample rates for both dataframes
                    sample_rate1 = 1 / (df1["time"].diff().mean())
                    sample_rate2 = 1 / (df2["time"].diff().mean())

                    # Determine the finer sample rate for resampling
                    finer_sample_rate = max(sample_rate1, sample_rate2)

                    # Define a common time grid (use min/max from both datasets)
                    min_time = max(df1["time"].min(), df2["time"].min())
                    max_time = min(df1["time"].max(), df2["time"].max())
                    common_time = np.arange(min_time, max_time, 1 / finer_sample_rate)

                    # Resample both dataframes to the common time grid
                    resampled_df1 = self._resample_dataframe(
                        df1, sample_rate1, common_time
                    )
                    resampled_df2 = self._resample_dataframe(
                        df2, sample_rate2, common_time
                    )

                    # Compute cross-correlation
                    signal1 = resampled_df1["pt_fu_02"] - np.mean(
                        resampled_df1["pt_fu_02"]
                    )
                    signal2 = resampled_df2["pt_fu_02"] - np.mean(
                        resampled_df2["pt_fu_02"]
                    )
                    correlation = correlate(signal1, signal2, mode="full")
                    lag = np.argmax(correlation) - (len(signal2) - 1)

                    # Convert lag to time shift
                    time_shift = (
                        lag / finer_sample_rate
                    )  # Convert index shift to time shift

                    # Apply the time shift to df2
                    df2_aligned_time = df2["time"] + time_shift

                    # Interpolate df2 onto df1’s original time grid
                    df2_interp = np.interp(
                        df1["time"], df2_aligned_time, df2["pt_fu_02"]
                    )

                    # Merge the aligned data
                    merged_df = pd.DataFrame(
                        {"time": df1["time"], "pt_fu_02": df2_interp}
                    )
                    aligned_dfs.append(merged_df)

        self.aligned_dataframes = aligned_dfs
        return aligned_dfs

    def plot_aligned_data(self):
        """
        Plot aligned dataframes
        """
        if not self.aligned_dataframes:
            raise ValueError(
                "Please align dataframes first using align_by_correlation()"
            )

        plt.figure(figsize=(15, 10))

        # select non-time columns
        columns = set()
        for df in self.aligned_dataframes:
            columns.update([col for col in df.columns if col != "time"])

        # plot cols
        for col in columns:
            for i, df in enumerate(self.aligned_dataframes):
                if col in df.columns:
                    plt.plot(df["time"], df[col], label=f"{col} (Dataset {i + 1})")

        plt.title("Aligned Time Series Data")
        plt.xlabel("Aligned Time")
        plt.ylabel("Value")
        plt.legend(bbox_to_anchor=(1.05, 1), loc="upper left")
        plt.tight_layout()
        plt.grid(True)
        plt.show()

    def merge_aligned_dataframes(self) -> pd.DataFrame:
        """
        Merge aligned dataframes.
        """
        if not self.aligned_dataframes:
            raise ValueError(
                "Please align dataframes first using align_by_correlation()"
            )

        # Set time as index and merge
        indexed_dfs = [df.set_index("time") for df in self.aligned_dataframes]
        # print(indexed_dfs)
        merged_df = pd.concat(indexed_dfs, ignore_index=True)
        dedup_df = merged_df.drop_duplicates()
        # print(dedup_df.columns)
        # sorted_df = dedup_df.sort_values(by="time", axis=1, ascending=True)
        # df = dedup_df.drop("index", axis=1)

        return dedup_df.reset_index()

    def _resample_dataframe(
        self, df: pd.DataFrame, sample_rate: float, common_time: np.ndarray
    ) -> pd.DataFrame:
        """
        Resample a dataframe to a common time grid using linear interpolation.

        Args:
            df (pd.DataFrame): The dataframe to resample. Must contain a 'time' column.
            sample_rate (float): The sample rate of the dataframe (not used directly here but kept for compatibility).
            common_time (np.ndarray): The common time grid to resample onto.

        Returns:
            pd.DataFrame: A new dataframe resampled to the common time grid.
        """
        # Ensure the dataframe is sorted by time
        df = df.sort_values(by="time")

        # Create a dictionary to hold resampled data
        resampled_data = {"time": common_time}

        # Interpolate each column (excluding 'time') onto the common time grid
        for col in df.columns:
            if col != "time":
                resampled_data[col] = np.interp(common_time, df["time"], df[col])

        # Return the resampled dataframe
        return pd.DataFrame(resampled_data)
