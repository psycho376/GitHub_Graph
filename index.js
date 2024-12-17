const FILE_PATH = "./data.json";
const simpleGit = require("simple-git");
const jsonfile = require("jsonfile");
const moment = require("moment");
const random = require("random");

// Change the working directory to where your local repository is located
const git = simpleGit(".");

const makeCommit = (n) => {
  if (n === 0) {
    // Push changes to the remote repository
    git.push(["-u", "origin", "main"], (err, result) => {
      if (err) {
        console.error("Error pushing to remote:", err);
      } else {
        console.log("Pushed changes to remote repository");
      }
    });
    return;
  }

  // Generate random position for the contribution graph
  const x = random.int(0, 51); // 52 weeks in a year
  const y = random.int(0, 6);  // 7 days in a week
  
  // Calculate date starting from 2 years ago
  const DATE = moment()
    .subtract(2, 'years')
    .startOf('year')              // Start from beginning of year
    .add(x, 'weeks')             // Add weeks
    .add(y, 'days')              // Add days
    .set('hour', random.int(9, 17))    // Random work hour (9 AM to 5 PM)
    .set('minute', random.int(0, 59))
    .set('second', random.int(0, 59))
    .format('YYYY-MM-DDTHH:mm:ssZ');  // ISO 8601 format

  const data = {
    date: DATE,
  };
  console.log(DATE);

  jsonfile.writeFile(FILE_PATH, data, () => {
    git
      .add([FILE_PATH])
      .commit(DATE, { "--date": DATE })
      .push(["-u", "origin", "main"], (err, result) => {
        if (err) {
          console.error("Error pushing to remote:", err);
        } else {
          console.log("Pushed changes to remote repository");
          makeCommit(--n);
        }
      });
  });
};

// Initialize repository and create first commit
const initRepo = async () => {
  try {
    // Create initial data
    const data = {
      date: moment().format('YYYY-MM-DDTHH:mm:ssZ'),
      message: "Initial commit"
    };
    
    await jsonfile.writeFile(FILE_PATH, data);
    await git.add([FILE_PATH]);
    await git.commit("Initial commit");
    console.log("Repository initialized successfully");
    
    // Start the contribution process
    makeCommit(120);
  } catch (err) {
    console.error("Error initializing repository:", err);
  }
};

// Start the process
initRepo();
