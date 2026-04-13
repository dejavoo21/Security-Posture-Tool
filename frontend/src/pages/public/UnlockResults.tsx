import { FormEvent, useEffect, useState, type ChangeEvent } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "../../components/shared/Layout";
import { apiService } from "../../services/api";

type AuthMode = "register" | "login";

const getInitialMode = (mode: string | null): AuthMode => mode === "login" ? "login" : "register";

export function UnlockResults() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(getInitialMode(searchParams.get("mode")));
  const [result, setResult] = useState<any>(null);
  const [isLoadingResult, setIsLoadingResult] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [success, setSuccess] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    organizationName: "",
    title: ""
  });

  useEffect(() => {
    async function loadResult() {
      try {
        const data = await apiService.getResults(id!);
        setResult(data);
        setFormData((current) => ({
          ...current,
          organizationName: data.companyData?.name || ""
        }));
      } catch {
        setError("We could not load this completed assessment. Please return to your results page.");
      } finally {
        setIsLoadingResult(false);
      }
    }

    loadResult();
  }, [id]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setErrorCode(null);

    try {
      const payload = {
        ...formData,
        organizationName: formData.organizationName || result?.companyData?.name || "My Organization",
        organizationIndustry: result?.companyData?.industry,
        organizationSize: result?.companyData?.size,
        title: formData.title,
        publicSessionId: id
      };

      const response = mode === "register"
        ? await apiService.register(payload)
        : await apiService.login({
          email: formData.email,
          password: formData.password,
          publicSessionId: id
        });

      if (response.error) {
        setError(response.error);
        setErrorCode(response.code || response.conversion?.status || null);
        return;
      }

      if (!response.token || !response.user) {
        setError("Account access succeeded, but the assessment could not be saved. Please try again.");
        setErrorCode("SAVE_FAILED");
        return;
      }

      window.localStorage.setItem("authToken", response.token);
      window.localStorage.setItem("authUser", JSON.stringify(response.user));
      setSuccess(response);
    } catch {
      setError("A network error occurred while saving your assessment.");
      setErrorCode("NETWORK_ERROR");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingResult) {
    return (
      <Layout>
        <div className="loading-state">Preparing your saved-results flow...</div>
      </Layout>
    );
  }

  if (success) {
    const conversionStatus = success.conversion?.status === "already_converted" ? "already saved" : "saved";

    return (
      <Layout>
        <section className="page-container" style={{ maxWidth: 860, margin: "0 auto" }}>
          <div className="surface-card" role="status" aria-live="polite">
            <p className="eyebrow">Assessment {conversionStatus}</p>
            <h2 className="page-title">Your results are now connected to your account.</h2>
            <p className="muted-text">
              {result?.companyData?.name} has been preserved. You can continue from the saved summary now, without retaking the assessment.
            </p>
            <div style={{ marginTop: 28, display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link to={`/results/${id}?saved=1`} className="button-primary">View saved result</Link>
              <Link to="/" className="button-secondary">Go to workspace home</Link>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="page-container" style={{ maxWidth: 980, margin: "0 auto" }}>
        <div className="score-card" style={{ marginBottom: 32 }}>
          <p className="eyebrow" style={{ color: "#fff" }}>Save completed assessment</p>
          <h2 style={{ fontSize: "2rem", margin: "0 0 12px 0", color: "#fff" }}>
            Save results and unlock full report
          </h2>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.76)" }}>
            Your completed result for {result?.companyData?.name || "this organization"} is still active. Create an account or sign in to attach it to your workspace.
          </p>
          <div className="score-card__grid">
            <div className="score-tile">
              <p className="score-tile__label">Score</p>
              <p className="score-tile__value">{result?.overallScore}%</p>
            </div>
            <div className="score-tile">
              <p className="score-tile__label">Maturity</p>
              <p className="score-tile__value">{result?.maturityLevel}</p>
            </div>
            <div className="score-tile">
              <p className="score-tile__label">Risk</p>
              <p className="score-tile__value">{result?.riskLevel}</p>
            </div>
          </div>
        </div>

        <div className="surface-card">
          <div role="tablist" aria-label="Save assessment options" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "register"}
              className={mode === "register" ? "button-primary" : "button-secondary"}
              onClick={() => setMode("register")}
            >
              Create account to continue
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              className={mode === "login" ? "button-primary" : "button-secondary"}
              onClick={() => setMode("login")}
            >
              Sign in to save this assessment
            </button>
          </div>

          {error && (
            <div className="error-state" role="alert" aria-live="assertive" style={{ marginBottom: 24, padding: 16 }}>
              <p className="error-text" style={{ margin: 0 }}>{error}</p>
              {errorCode === "EMAIL_EXISTS" && (
                <button
                  type="button"
                  className="button-secondary"
                  style={{ marginTop: 12 }}
                  onClick={() => {
                    setMode("login");
                    setError("This email already has an account. Sign in to save this assessment.");
                    setErrorCode(null);
                  }}
                >
                  Sign in instead
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-grid">
            {mode === "register" && (
              <>
                <div className="form-field">
                  <label htmlFor="fullName">Full Name *</label>
                  <input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
                </div>
                <div className="form-field">
                  <label htmlFor="organizationName">Organization *</label>
                  <input id="organizationName" name="organizationName" value={formData.organizationName} onChange={handleChange} required />
                </div>
                <div className="form-field">
                  <label htmlFor="title">Title or Role</label>
                  <input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Security lead, founder, operator" />
                </div>
              </>
            )}

            <div className="form-field">
              <label htmlFor="email">Email Address *</label>
              <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label htmlFor="password">Password *</label>
              <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required minLength={8} />
            </div>

            <div className="form-span-2" style={{ marginTop: 12 }}>
              <button type="submit" className="button-primary" style={{ width: "100%" }} disabled={isSubmitting}>
                {isSubmitting ? "Saving assessment..." : mode === "register" ? "Create account and save results" : "Sign in and save assessment"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
