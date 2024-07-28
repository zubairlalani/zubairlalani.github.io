import pandas as pd

def join_csv_files(file1, file2, join_column, output_file):
    # Load the CSV files into DataFrames
    df1 = pd.read_csv(file1)
    df2 = pd.read_csv(file2)
    
    # Perform the join on the specified column
    merged_df = pd.merge(df1, df2, on=join_column)
    
    # Save the merged DataFrame to a new CSV file
    merged_df.to_csv(output_file, index=False)
    print(f"Files merged successfully into {output_file}")

# Usage example
file1 = 'data/cleaned_hm.csv'
file2 = 'data/demographic.csv'
join_column = 'wid'
output_file = 'data/hm_plus_demographic.csv'

join_csv_files(file1, file2, join_column, output_file)
