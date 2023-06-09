import { getDatabase, ref, set, onValue } from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Profile(props) {
  const [jobsAppliedTo, setJobsAppliedTo] = useState([]);
  const [jobsInterviewCount, setJobsInterviewCount] = useState(0);
  const [jobsOfferPendingCount, setJobsOfferPendingCount] = useState(0);
  const [jobsRejectedCount, setJobsRejectedCount] = useState(0);

  useEffect(() => {
    const db = getDatabase();
    const userJobsRef = ref(db, `users/${props.currentUser.uid}/jobs`);
    onValue(userJobsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const jobs = Object.values(data);
        setJobsAppliedTo(jobs);
        setJobsInterviewCount(jobs.filter(job => job.status === 'Interview').length);
        setJobsOfferPendingCount(jobs.filter(job => job.status === 'Offer Pending').length);
        setJobsRejectedCount(jobs.filter(job => job.status === 'Rejected').length);
      }
    });
  }, [props.currentUser]);

  const jobsAppliedToCount = jobsAppliedTo.length;

  return (
    <div>
      <main>
        <header className="profile-header">
          <h1>Profile</h1>
        </header>
        <div className='card'>
          <div className="profile">
            <p className="profile-welcome">Welcome {props.currentUser.userName && props.currentUser.userName}!</p>
            <div className="profile-info">
              <p>Total Jobs Applied To: {jobsAppliedToCount}</p>
              <p>Job Interviews: {jobsInterviewCount}</p>
              <p>Job Offers Pending: {jobsOfferPendingCount}</p>
              <p>Job Rejections: {jobsRejectedCount}</p>
            </div>
            <div className="dashboard-link">
              <Link to="/dashboard">
                <button type="button" className="btn btn-light btn-lg">View Your Dashboard</button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}