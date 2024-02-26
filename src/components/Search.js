import { TextField } from "@mui/material";

function Search({ label, onChange }) {
    return (
        <TextField
            id="outlined-basic"
            label={label}
            variant="outlined"
            onChange={(e) => onChange(e.target.value)}
        />
    );
}


export default Search;