import pandas as pd


def convert_age_column(input_file, output_file, age_column):
    # Load the CSV file into a DataFrame
    df = pd.read_csv(input_file)
    
    # Replace the phrase "prefer not to say" with -1
    df[age_column] = df[age_column].replace("prefer not to say", -1)
    
    # Convert the age column to integers
    df[age_column] = pd.to_numeric(df[age_column], errors='coerce').fillna(-1).astype(int)
    
    # Save the updated DataFrame to a new CSV file
    df.to_csv(output_file, index=False)
    print(f"Age column converted and saved to {output_file}")
    

input_file = 'data/hm_plus_demographic.csv'
output_file = 'data/test_clean_out.csv'

convert_age_column(input_file, output_file, 'age')

