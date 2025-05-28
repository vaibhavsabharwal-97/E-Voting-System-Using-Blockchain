import axios from "axios";
import { serverLink } from "./Variables";

export const ObjectGroupBy = (object, group) => {
  var ans = {};
  object.forEach(function (item) {
    var list = ans[item[group]];
    list ? list.push(item) : (ans[item[group]] = [item]);
  });
  return ans;
};

export const ObjectKeyReplace = (object, data, oldColumn, newColum) => {
  Object.keys(object).forEach((key) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i][oldColumn] === key) {
        var newKey = data[i][newColum];
        object[newKey] = object[key];
        delete object[key];
        break;
      }
    }
  });
  return object;
};

export const TwoArraySort = (mainArray, secondaryArray) => {
  for (let i = 0; i < mainArray.length; i++) {
    for (let j = 0; j < mainArray.length - i - 1; j++) {
      if (mainArray[j] < mainArray[j + 1]) {
        [mainArray[j], mainArray[j + 1]] = [mainArray[j + 1], mainArray[j]];
        [secondaryArray[j], secondaryArray[j + 1]] = [
          secondaryArray[j + 1],
          secondaryArray[j],
        ];
      }
    }
  }
  return [mainArray, secondaryArray];
};

export const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

export const stringToAv = (fname, lname) => {
  let n = fname[0] + lname[0];
  return n;
};

export const getResult = async (transactions) => {
  // Return empty results if no transactions
  if (!transactions || transactions.length === 0) {
    console.log("No transactions provided to getResult");
    return [];
  }

  try {
    // Fetch all candidates
    let link = serverLink + "candidates";
    let res = await axios.get(link);
    const candidates = res.data || [];
    
    if (candidates.length === 0) {
      console.log("No candidates found in the system");
      return [];
    }

    // Fetch all elections
    link = serverLink + "elections";
    res = await axios.get(link);
    const electionsD = res.data || [];
    
    if (electionsD.length === 0) {
      console.log("No elections found in the system");
      return [];
    }

    // Group transactions by election ID
    var electionGroup = ObjectGroupBy(transactions, "election_id");
    if (Object.keys(electionGroup).length === 0) {
      console.log("No valid election_id found in transactions");
      return [];
    }
    
    // Filter to only include elections that exist in the database
    var newElectionGroup = {};
    Object.keys(electionGroup).forEach((electionId) => {
      const matchingElection = electionsD.find(election => election._id === electionId);
      if (matchingElection) {
        newElectionGroup[electionId] = electionGroup[electionId];
      }
    });
    
    if (Object.keys(newElectionGroup).length === 0) {
      console.log("No transactions match existing elections");
      return [];
    }
    
    // Replace election IDs with election names
    electionGroup = ObjectKeyReplace(newElectionGroup, electionsD, "_id", "name");
    const elections = Object.keys(electionGroup);
    
    if (elections.length === 0) {
      console.log("No valid elections after key replacement");
      return [];
    }

    var results = [];

    // Process each election
    for (let i = 0; i < elections.length; i++) {
      const electionName = elections[i];
      
      // Group transactions by candidate ID
      var electionRes = ObjectGroupBy(electionGroup[electionName], "candidate_id");
      
      if (Object.keys(electionRes).length === 0) {
        console.log(`No valid candidate_id found for election ${electionName}`);
        continue;
      }
      
      // Create a mapping of candidate IDs to candidate full names
      const candidateMap = {};
      for (const candidateId of Object.keys(electionRes)) {
        // Find the candidate in the candidates array
        const candidate = candidates.find(c => c._id === candidateId);
        if (candidate) {
          candidateMap[candidateId] = {
            username: candidate.username,
            displayName: `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || candidate.username
          };
        } else {
          candidateMap[candidateId] = {
            username: candidateId,
            displayName: candidateId
          };
        }
      }
      
      // Replace candidate IDs with usernames
      electionRes = ObjectKeyReplace(electionRes, candidates, "_id", "username");
      
      let votes = [];
      let candidateList = Object.keys(electionRes);
      let candidateDisplayNames = [];
      
      if (candidateList.length === 0) {
        console.log(`No valid candidates after key replacement for election ${electionName}`);
        continue;
      }
      
      // Count votes for each candidate and prepare display names
      candidateList.forEach(candidateUsername => {
        votes.push(electionRes[candidateUsername].length);
        
        // Find the original candidate ID for this username
        const candidateId = Object.keys(candidateMap).find(id => candidateMap[id].username === candidateUsername);
        if (candidateId) {
          candidateDisplayNames.push(candidateMap[candidateId].displayName);
        } else {
          candidateDisplayNames.push(candidateUsername);
        }
      });
      
      // Sort results by vote count (highest first)
      let sortedIndices = votes.map((_, i) => i).sort((a, b) => votes[b] - votes[a]);
      
      let sortedVotes = sortedIndices.map(i => votes[i]);
      let sortedCandidates = sortedIndices.map(i => candidateList[i]);
      let sortedDisplayNames = sortedIndices.map(i => candidateDisplayNames[i]);
      
      results.push({ 
        name: electionName, 
        candidates: sortedCandidates, 
        candidateDisplayNames: sortedDisplayNames,
        vote: sortedVotes 
      });
    }
    
    return results;
  } catch (error) {
    console.error("Error in getResult:", error);
    return [];
  }
};
