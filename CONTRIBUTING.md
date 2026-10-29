# Contributing

This guide describes the standard path for taking a task from an issue through review and into `main`.

## 1. Create or choose an issue

Open an issue for each feature, bug, or substantial maintenance task before starting work. Search existing issues first to avoid duplicates. Small, self-contained corrections (such as fixing a typo) may be handled without a separate issue.

An issue should explain:

- The problem or goal, with enough context to understand why the change is needed.
- The expected behavior or outcome.
- Acceptance criteria that can be checked when the work is done.
- Relevant constraints, risks, or dependencies, if any.

Clarify the scope and acceptance criteria before implementation. Split work into separate issues when it can be delivered and reviewed independently.

## 2. Create a branch

Start from an up-to-date `main` branch and create one branch per issue. Use the issue number and a short, descriptive name:

```text
feature/42-player-scores
fix/57-invalid-score-validation
docs/63-local-development-guide
chore/71-update-dependencies
```

Use `feature/`, `fix/`, `docs/`, or `chore/` to describe the kind of work. Do not commit task changes directly to `main`.

## 3. Implement and verify

- Keep the change focused on the issue and follow the existing project structure and conventions.
- Add or update tests when behavior changes. Do not mark a behavior change as verified if no relevant test or check was run.
- For database changes, include and review the EF Core migration; do not make production startup silently create or migrate the database.
- Keep secrets and environment-specific credentials out of source control.
- Run the checks relevant to the change. For backend changes, from the repository root:

  ```powershell
  dotnet build Breakout.sln
  dotnet test Breakout.sln
  ```

  The solution may not yet contain test projects; in that case, report that tests were unavailable rather than implying they passed. Run any additional checks required by the affected code.
- Review the final diff for unrelated changes, accidental files, and configuration or documentation that should accompany the implementation.

Commit related changes with clear, descriptive messages. Keep commits free of secrets and generated build output.

## 4. Open a pull request

Push the branch and open a pull request targeting `main`. Link the issue in the PR description using `Closes #<issue-number>` so it closes when the PR is merged.

The PR description should include:

- A concise summary of the change and its motivation.
- How the change was tested, including checks that could not be run.
- Screenshots or API examples when they make a UI or API change easier to review.
- Any migration, configuration, deployment, or follow-up considerations.

Keep the PR focused and reasonably sized. If its scope changes, update the issue and PR description.

## 5. Review and revise

Reviewers should check that the change meets the issue's acceptance criteria, fits the project architecture, handles relevant failures and edge cases, and includes suitable tests and documentation. Pay particular attention to security boundaries, untrusted input, secrets, and database migrations where applicable.

The author should respond to review feedback, make requested changes on the same branch, and rerun affected checks. Resolve each review conversation once it has been addressed. The PR is ready to merge when it has approval, all required checks are passing, and no blocking review comments remain. If automated checks are not configured, the author is responsible for reporting the local checks that were run.

## 6. Merge into `main`

Merge the approved PR into `main` using the repository's configured merge method. Confirm the PR targets `main` and its checks and conversations are complete before merging. Delete the feature branch after the merge when it is no longer needed.

The linked issue should close through the PR. If it does not, close it manually with a brief note describing the delivered outcome. Follow-up work should be captured in a new issue rather than left as an undocumented change in scope.
