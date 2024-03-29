import React from "react";
import { styled } from '@mui/material/styles';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Grid, Paper } from "@mui/material";
import clsx from "clsx";
const PREFIX = 'MarkingRange';

const classes = {
  table: `${PREFIX}-table`
};

const StyledGrid = styled(Grid)((
  {
    theme
  }
) => ({
  [`& .${classes.table}`]: {
    width: "auto",
    tableLayout: "auto",
    fontSize: [10, "!important"],
  }
}));

const MarkingRange = () => {

  return (
    <StyledGrid>
      <TableContainer component={Paper}>
        <Table
          className={clsx(classes.table)}
          aria-label="spanning table"
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">Marking Range</TableCell>
              <TableCell align="center">Definition</TableCell>
              <TableCell align="center">Examples</TableCell>
              <TableCell align="center">Duration</TableCell>
              <TableCell align="center">Min Competence Level</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={clsx(classes.table)}>
            <TableRow key={1}>
              <TableCell align="center">A</TableCell>
              <TableCell align="left">
                {
                  "Very well-defined marking criteria; working to prepared/model answer(s); limited academic discretion/judgement required; high level of specialist knowledge not required"
                }
              </TableCell>
              <TableCell align="left">
                {
                  "Mathematical, technical and computational assessments, such as lab books and other assignments which map onto the criteria listed under Definition A"
                }
              </TableCell>
              <TableCell align="left">
                {"6 pieces per hour (10 mins per piece1)"}
              </TableCell>
              <TableCell align="center">{"AC1/PGR A"}</TableCell>
            </TableRow>
            <TableRow key={2}>
              <TableCell align="center">B</TableCell>
              <TableCell align="left">
                {
                  "Well-defined criteria; some guidance provided on model answer, but requires interpretation of responses based on academic judgement/discretion; a level of specialist knowledge required as well as the ability to assess application and analysis of key principles in the discipline"
                }
              </TableCell>
              <TableCell align="left">
                {
                  "Shorter written pieces requiring significant correction/annotation eg language marking (AEL); tutorial package i.e. presentation & reflective reports (HAPP);  mathematical coursework, technical and computational assessments, such as lab books and other assignments which map onto the criteria listed under Definition B"
                }
              </TableCell>
              <TableCell align="left">
                {"3 pieces per hour (20 mins per piece)"}
              </TableCell>
              <TableCell align="center">{"AC1/PGR A"}</TableCell>
            </TableRow>
            <TableRow key={3}>
              <TableCell align="center">C</TableCell>
              <TableCell align="left">
                {
                  "Broad criteria to be applied, requiring substantial academic judgement to assess evidence of students' higher-level skills (e.g.interpretation/application/ analysis/synthesis/evaluation of materials and concepts); ability to undertake independent assessment and good level of specialist knowledge required"
                }
              </TableCell>
              <TableCell align="left">
                {
                  "Essay/Substantial written piece;  mathematical coursework, technical and computational assessments, such as lab books and other assignments which map onto the criteria listed under Definition C"
                }
              </TableCell>
              <TableCell size="medium" align="left">
                {
                  <ul>
                    <li>2-3000 = 20 mins (3 pieces per hour)</li>
                    <li>3-4000 = 30 mins (2 pieces per hour)</li>
                    <li>4-5000 = 40 mins (1.5 per hour)</li>
                    <li>
                      Greater than 5000 words = 45 mins (2 per 1.5 hours or 4
                      per 3 hours)
                    </li>
                    <li>
                      Lab books and other assignments within mathematical,
                      technical and computational assessments in range C = 30
                      mins (2 pieces per hour)
                    </li>
                  </ul>
                }
              </TableCell>
              <TableCell align="center">{"AC2/PGR B"}</TableCell>
            </TableRow>
            <TableRow key={4}>
              <TableCell align="center">D</TableCell>
              <TableCell align="left">
                {
                  "Well-defined criteria, but requires interpretation of responses based on a level of specialist knowledge and the ability to assess application and analysis of key principles"
                }
              </TableCell>
              <TableCell align="left">{"Oral Exam"}</TableCell>
              <TableCell align="left">
                {
                  "Duration of the exam, including examiner discussion, plus 0.5 hours per hour of exam"
                }
              </TableCell>
              <TableCell align="center">{"AC2/PGR B"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </StyledGrid>
  );
};

export default MarkingRange;
